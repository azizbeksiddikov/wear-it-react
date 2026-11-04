import React, { ReactNode, useEffect, useState } from 'react';
import { Member } from '../../libs/types/member';
import { GlobalContext } from '../hooks/useGlobals';
import MemberService from '../services/MemberService';

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [authMember, setAuthMember] = useState<Member | null>(
		localStorage.getItem('memberData') ? JSON.parse(localStorage.getItem('memberData') as string) : null,
	);
	const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

	// The session cookie is httpOnly, so the page cannot see it. The member in localStorage is only a
	// hint that lets the header render signed-in at once; the server decides. Ask it on every start.
	useEffect(() => {
		const verifyAuth = async () => {
			try {
				const member = await new MemberService().getMemberDetail();
				setAuthMember(member); // null when the server says nobody is signed in
			} catch {
				// Offline or server error: keep what is shown. Only a 401 (handled above) signs the shopper out.
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
