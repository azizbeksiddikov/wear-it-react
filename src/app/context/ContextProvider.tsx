import React, { ReactNode, useState, useEffect } from 'react';
import { Member } from '../../libs/types/member';
import { GlobalContext } from '../hooks/useGlobals';
import MemberService from '../services/MemberService';

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [authMember, setAuthMember] = useState<Member | null>(
		localStorage.getItem('memberData') ? JSON.parse(localStorage.getItem('memberData') as string) : null,
	);
	const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

	// Verify authentication on mount
	useEffect(() => {
		const verifyAuth = async () => {
			// If we have memberData in localStorage, verify it with the backend
			if (localStorage.getItem('memberData')) {
				try {
					const memberService = new MemberService();
					const member = await memberService.getMemberDetail();
					if (member) {
						setAuthMember(member);
					} else {
						// Token is invalid, clear local storage
						setAuthMember(null);
						localStorage.removeItem('memberData');
					}
				} catch (err) {
					// If verification fails, don't immediately clear - might be a network issue
					// Only clear if it's an auth error (401)
					if (err && typeof err === 'object' && 'response' in err) {
						const axiosError = err as { response?: { status?: number } };
						if (axiosError.response?.status === 401) {
							setAuthMember(null);
							localStorage.removeItem('memberData');
						}
					}
				}
			}
		};

		verifyAuth();
	}, []);

	return (
		<GlobalContext.Provider value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}>
			{children}
		</GlobalContext.Provider>
	);
};

export default ContextProvider;
