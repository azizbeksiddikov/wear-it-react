import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Fab, TextField, Box, InputAdornment, IconButton } from '@mui/material';
import styled from 'styled-components';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { T } from '../../../libs/types/common';
import { Messages } from '../../../libs/config';
import { LoginInput, MemberInput } from '../../../libs/types/member';
import MemberService from '../../services/MemberService';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { useGlobals } from '../../hooks/useGlobals';

const StyledTextField = styled(TextField)`
	width: 100%;

	& .MuiOutlinedInput-root {
		border-radius: 8px;
	}
`;

const StyledFab = styled(Fab)`
	width: 100% !important;
	border-radius: 8px !important;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
	text-transform: none !important;
	margin-top: 16px !important;
`;

const ModalTitle = styled.h2`
	font-size: 24px;
	font-weight: 600;
	color: #333;
	margin-bottom: 24px;
	text-align: center;
`;

const CustomModalOverlay = styled.div<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(4px);
	display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
	align-items: center;
	justify-content: center;
	z-index: 1300;
	animation: ${(props) => (props.$isOpen ? 'fadeIn 0.2s ease-in' : 'none')};

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

const CustomModalContent = styled(Box)<{ $isOpen: boolean }>`
	background-color: #ffffff;
	border-radius: 16px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	padding: 2rem;
	max-width: 400px;
	width: 100%;
	outline: none;
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	animation: ${(props) => (props.$isOpen ? 'slideUp 0.3s ease-out' : 'none')};

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

interface AuthenticationModalProps {
	signupOpen: boolean;
	loginOpen: boolean;
	handleSignupClose: () => void;
	handleLoginClose: () => void;
	returnPath?: string;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
	const { signupOpen, loginOpen, handleSignupClose, handleLoginClose, returnPath = '/' } = props;
	const navigate = useNavigate();
	const [memberEmail, setMemberEmail] = useState('');
	const [memberPhone, setMemberPhone] = useState('');
	const [memberPassword, setMemberPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showLoginPassword, setShowLoginPassword] = useState(false);

	const { setAuthMember } = useGlobals();
	const member = new MemberService();

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (signupOpen || loginOpen) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	}, [signupOpen, loginOpen]);

	// Reset form fields when modals close
	useEffect(() => {
		if (!signupOpen && !loginOpen) {
			setMemberEmail('');
			setMemberPhone('');
			setMemberPassword('');
			setConfirmPassword('');
			setShowPassword(false);
			setShowConfirmPassword(false);
			setShowLoginPassword(false);
		}
	}, [signupOpen, loginOpen]);

	/** HANDLERS **/
	const handleUserEmail = (e: T) => {
		setMemberEmail(e.target.value);
	};

	const handlePhone = (e: T) => {
		const input = e.target.value.replace(/[^\d]/g, '');

		// Format with dashes
		let formattedNumber = '';
		if (input.length <= 3) {
			formattedNumber = input;
		} else if (input.length <= 7) {
			formattedNumber = `${input.slice(0, 3)}-${input.slice(3)}`;
		} else {
			formattedNumber = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
		}

		e.target.value = formattedNumber;
		setMemberPhone(formattedNumber);
	};
	const handlePassword = (e: T) => {
		setMemberPassword(e.target.value);
	};
	const handleConfirmPassword = (e: T) => {
		setConfirmPassword(e.target.value);
	};

	const handlePasswordKeyDown = (e: T) => {
		// signup
		if (e.key === 'Enter' && signupOpen) {
			handleSignupRequest().then();
		}
		// login
		else if (e.key === 'Enter' && loginOpen) {
			handleLoginRequest().then();
		}
	};

	// Signup request
	const handleSignupRequest = async () => {
		try {
			const errorMessage: string | null = validateSignupInput(
				memberEmail,
				memberPhone,
				memberPassword,
				confirmPassword,
			);
			if (errorMessage) throw new Error(errorMessage);

			const signupInput: MemberInput = {
				memberEmail: memberEmail,
				memberPhone: memberPhone,
				memberPassword: memberPassword,
			};

			const result = await member.signup(signupInput);
			setAuthMember(result);

			// Reset form fields
			setMemberEmail('');
			setMemberPhone('');
			setMemberPassword('');
			setConfirmPassword('');
			setShowPassword(false);
			setShowConfirmPassword(false);

			handleSignupClose();
			await sweetTopSuccessAlert('success', 1400);
		} catch (err) {
			handleSignupClose();
			sweetErrorHandling(err, 1400).then();
		}
	};

	// Login request
	const handleLoginRequest = async () => {
		try {
			const isFulFill = memberEmail !== '' && memberPassword !== '';
			if (!isFulFill) throw new Error(Messages.error3);

			const loginInput: LoginInput = {
				memberEmail: memberEmail,
				memberPassword: memberPassword,
			};

			const result = await member.login(loginInput, false); // Pass false to skip hard redirect
			setAuthMember(result);

			// Reset form fields
			setMemberEmail('');
			setMemberPassword('');
			setShowLoginPassword(false);

			handleLoginClose();
			await sweetTopSuccessAlert('success', 1400);

			// Navigate back to the page where user started from
			navigate(returnPath);
		} catch (err) {
			handleLoginClose();
			sweetErrorHandling(err, 1400).then();
		}
	};

	const modalRoot = typeof document !== 'undefined' ? document.body : null;

	if (!modalRoot) return null;

	return (
		<>
			{/* Signup modal */}
			{createPortal(
				<CustomModalOverlay $isOpen={signupOpen} onClick={handleSignupClose}>
					<CustomModalContent $isOpen={signupOpen} onClick={(e) => e.stopPropagation()}>
						<ModalTitle>Join Wear It</ModalTitle>
						<StyledTextField
							id="signup-email"
							label="Email"
							variant="outlined"
							fullWidth
							value={memberEmail}
							onChange={handleUserEmail}
						/>
						<StyledTextField
							id="signup-phone"
							label="Phone number"
							variant="outlined"
							fullWidth
							value={memberPhone}
							onChange={handlePhone}
						/>
						<StyledTextField
							id="signup-password"
							label="Password"
							variant="outlined"
							type={showPassword ? 'text' : 'password'}
							fullWidth
							value={memberPassword}
							onChange={handlePassword}
							error={memberPassword !== '' && memberPassword.length > 0 && memberPassword.length < 6}
							helperText={
								memberPassword !== '' && memberPassword.length > 0 && memberPassword.length < 6
									? 'Password should be at least 6 characters'
									: ''
							}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShowPassword(!showPassword)}
											edge="end"
										>
											{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<StyledTextField
							id="signup-confirm-password"
							label="Confirm Password"
							variant="outlined"
							type={showConfirmPassword ? 'text' : 'password'}
							fullWidth
							value={confirmPassword}
							onChange={handleConfirmPassword}
							onKeyDown={handlePasswordKeyDown}
							error={confirmPassword !== '' && confirmPassword !== memberPassword}
							helperText={confirmPassword !== '' && confirmPassword !== memberPassword ? 'Passwords do not match' : ''}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											edge="end"
										>
											{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<StyledFab variant="extended" color="primary" onClick={handleSignupRequest}>
							<LoginIcon sx={{ mr: 1 }} />
							Create Account
						</StyledFab>
					</CustomModalContent>
				</CustomModalOverlay>,
				modalRoot,
			)}

			{/* Login modal */}
			{createPortal(
				<CustomModalOverlay $isOpen={loginOpen} onClick={handleLoginClose}>
					<CustomModalContent $isOpen={loginOpen} onClick={(e) => e.stopPropagation()}>
						<ModalTitle>Welcome Back</ModalTitle>
						<StyledTextField
							id="login-email"
							label="Email"
							variant="outlined"
							fullWidth
							value={memberEmail}
							onChange={handleUserEmail}
						/>
						<StyledTextField
							id="login-password"
							label="Password"
							variant="outlined"
							type={showLoginPassword ? 'text' : 'password'}
							fullWidth
							value={memberPassword}
							onChange={handlePassword}
							onKeyDown={handlePasswordKeyDown}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShowLoginPassword(!showLoginPassword)}
											edge="end"
										>
											{showLoginPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<StyledFab variant="extended" color="primary" onClick={handleLoginRequest}>
							<LoginIcon sx={{ mr: 1 }} />
							Log In
						</StyledFab>
					</CustomModalContent>
				</CustomModalOverlay>,
				modalRoot,
			)}
		</>
	);
}

function validateSignupInput(
	memberEmail: string,
	memberPhone: string,
	memberPassword: string,
	confirmPassword: string,
): string | null {
	// Check if all required fields are filled
	if (!memberEmail || !memberPhone || !memberPassword || !confirmPassword) {
		return 'Please fill in all required fields';
	}

	// Validate email
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(memberEmail)) {
		return 'Please enter a valid email address';
	}

	// Validate phone number
	const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
	if (!phoneRegex.test(memberPhone)) {
		return 'Please enter phone number in format: 010-1111-1111';
	}

	// Password validation
	if (memberPassword.length < 6) {
		return 'Password must be at least 6 characters long';
	}
	// Check if passwords match
	if (memberPassword !== confirmPassword) {
		return 'Passwords do not match';
	}

	return null;
}
