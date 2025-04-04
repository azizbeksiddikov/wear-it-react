import axios from 'axios';
import { LoginInput, Member, MemberInput } from '../../libs/types/member';
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
			return member;
		} catch (err) {
			console.log('Error, signup', err);
			throw err;
		}
	}

	public async login(input: LoginInput): Promise<Member> {
		try {
			const url = this.path + '/member/login';
			const result = await axios.post(url, input, {
				withCredentials: true,
			});

			const member: Member = result.data.member;
			localStorage.setItem('memberData', JSON.stringify(member));
			return member;
		} catch (err) {
			console.log('Error, login', err);
			throw err;
		}
	}

	public async logout(): Promise<void> {
		try {
			const url = this.path + '/member/logout';
			const result = await axios.post(url, {}, { withCredentials: true });
			console.log('logout', result);

			localStorage.removeItem('memberData');
		} catch (err) {
			console.log('Error, login', err);
			throw err;
		}
	}
}

export default MemberService;
