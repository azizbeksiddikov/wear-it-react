import axios from 'axios';
import { serverApi } from '../../libs/config';
import { LoginInput, Member, MemberInput, MemberUpdateInput } from '../../libs/types/member';

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

	/**
	 * Ask the server who is signed in. The session cookie is httpOnly, so the page cannot read it:
	 * this call is the only way to know. A 401 means nobody is signed in (returns null); any other
	 * failure (offline, server down) is thrown so the caller can keep what it shows.
	 */
	public async getMemberDetail(): Promise<Member | null> {
		try {
			const url = `${this.path}/member/detail`;
			const result = await axios.get(url, {
				withCredentials: true,
			});

			const member: Member = result.data;
			localStorage.setItem('memberData', JSON.stringify(member));
			return member;
		} catch (err) {
			const status = (err as { response?: { status?: number } } | null)?.response?.status;
			if (status === 401) {
				localStorage.removeItem('memberData');
				return null;
			}
			throw err;
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

	/** Add free demo points to the balance (1 to 1,000 at a time). Returns the updated member. */
	public async topUp(amount: number): Promise<Member> {
		try {
			const url = `${this.path}/member/topup`;
			const result = await axios.post(url, { amount }, { withCredentials: true });

			const member: Member = result.data?.member ?? result.data;
			localStorage.setItem('memberData', JSON.stringify(member));
			return member;
		} catch (err) {
			console.log('Error, topUp', err);
			throw err;
		}
	}
}

export default MemberService;
