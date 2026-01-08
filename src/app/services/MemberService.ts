import axios from 'axios';
import { LoginInput, Member, MemberInput, MemberUpdateInput } from '../../libs/types/member';
import { serverApi } from '../../libs/config';

class MemberService {
	private readonly path: string;

	constructor() {
		this.path = serverApi;
	}

	public async signup(input: MemberInput): Promise<Member> {
		try {
			const url = this.path + '/member/signup';
			const result = await axios.post(url, input, {
				withCredentials: true,
			});

			const member: Member = result.data.member;

			localStorage.setItem('memberData', JSON.stringify(member));
			window.location.href = '/'; // Redirect to homepage

			return member;
		} catch (err) {
			console.log('Error, signup', err);
			throw err;
		}
	}

	public async login(input: LoginInput, redirect: boolean = true): Promise<Member> {
		try {
			const url = this.path + '/member/login';
			const result = await axios.post(url, input, {
				withCredentials: true,
			});

			const member: Member = result.data.member;
			localStorage.setItem('memberData', JSON.stringify(member));

			// Only redirect if explicitly requested (for backward compatibility)
			if (redirect) {
				window.location.href = '/';
			}

			return member;
		} catch (err) {
			console.log('Error, login', err);
			throw err;
		}
	}

	public async logout(): Promise<void> {
		try {
			const url = this.path + '/member/logout';
			await axios.post(url, {}, { withCredentials: true });
		} catch (err) {
			// If logout fails with 401 (unauthorized), token is already invalid/expired
			// This is fine - we'll clear local state anyway
			const isUnauthorized =
				err && typeof err === 'object' && 'response' in err && (err as any).response?.status === 401;

			if (isUnauthorized) {
				// Token expired/invalid - this is expected, don't log or throw
				return;
			}

			// For other errors (network issues, etc.), log but don't throw
			// We'll still clear local state
			console.log('Error, logout', err);
		} finally {
			// Always clear local storage, regardless of API response
			localStorage.removeItem('memberData');
		}
	}

	public async getMemberDetail(): Promise<Member | null> {
		try {
			const url = `${this.path}/member/detail`;
			const result = await axios.get(url, {
				withCredentials: true,
			});

			const member: Member = result.data;
			localStorage.setItem('memberData', JSON.stringify(member));
			return member;
		} catch {
			// If not authenticated, return null
			localStorage.removeItem('memberData');
			return null;
		}
	}

	public async update(input: MemberUpdateInput): Promise<Member> {
		try {
			const formData = new FormData();
			if (input.memberEmail) formData.append('memberEmail', input.memberEmail);
			if (input.memberPhone) formData.append('memberPhone', input.memberPhone);
			if (input.memberFullName) formData.append('memberFullName', input.memberFullName);
			if (input.memberAddress) formData.append('memberAddress', input.memberAddress);
			if (input.memberDesc) formData.append('memberDesc', input.memberDesc);
			if (input.memberImage) formData.append('memberImage', input.memberImage);
			if (input.memberPoints) formData.append('memberPoints', input.memberPoints.toString());

			const url = `${this.path}/member/update`;
			const result = await axios(url, {
				method: 'POST',
				data: formData,
				withCredentials: true,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			const member: Member = result.data;
			localStorage.setItem('memberData', JSON.stringify(member));
			return member;
		} catch (err) {
			console.log('Error, update', err);
			throw err;
		}
	}
}

export default MemberService;
