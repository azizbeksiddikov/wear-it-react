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
import { sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { friendlyErrorMessage } from '../../../libs/errorMessages';
import { useGlobals } from '../../hooks/useGlobals';

const StyledTextField = styled(TextField)`
	width: 100%;

	& .MuiOutlinedInput-root {
		border-radius: 8px;
	}

	& .MuiIconButton-root {
		width: 44px;
		height: 44px;
	}
`;

const StyledFab = styled(Fab)`
	width: 100% !important;
	border-radius: 8px !important;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
	text-transform: none !important;
	margin-top: 16px !important;
`;

const FormBody = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const FormError = styled.p`
	margin: 0;
	color: #c62828;
	font-size: 0.875rem;
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
	width: calc(100% - 2rem);
	box-sizing: border-box;
	max-height: calc(100dvh - 2rem);
	overflow-y: auto;
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
	const [formError, setFormError] = useState('');
	const [pending, setPending] = useState(false);

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

	// Focus the first field when a modal opens, and let Escape close it
	useEffect(() => {
		if (!signupOpen && !loginOpen) return;
		setFormError('');
		document.getElementById(signupOpen ? 'signup-email' : 'login-email')?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			if (signupOpen) handleSignupClose();
			if (loginOpen) handleLoginClose();
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	// Signup request
	const handleSignupRequest = async () => {
		if (pending) return;
		try {
			setFormError('');
			const errorMessage: string | null = validateSignupInput(
				memberEmail,
				memberPhone,
				memberPassword,
				confirmPassword,
			);
			if (errorMessage) {
				setFormError(errorMessage);
				return;
			}
			setPending(true);

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
			await sweetTopSuccessAlert('Welcome to Wearit', 1400);
		} catch (err) {
			// Keep the modal open and what the shopper typed, and say what to fix
			setFormError(friendlyErrorMessage(err));
		} finally {
			setPending(false);
		}
	};

	// Login request
	const handleLoginRequest = async () => {
		if (pending) return;
		try {
			setFormError('');
			const isFulFill = memberEmail !== '' && memberPassword !== '';
			if (!isFulFill) {
				setFormError(Messages.error3);
				return;
			}
			setPending(true);

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
			await sweetTopSuccessAlert('You are logged in', 1400);

			// Navigate back to the page where user started from
			navigate(returnPath);
		} catch (err) {
			setFormError(friendlyErrorMessage(err));
		} finally {
			setPending(false);
		}
	};

	const modalRoot = typeof document !== 'undefined' ? document.body : null;

	if (!modalRoot) return null;

	return (
		<>
			{/* Signup modal */}
			{createPortal(
				<CustomModalOverlay $isOpen={signupOpen} onClick={handleSignupClose}>
					<CustomModalContent
						$isOpen={signupOpen}
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-labelledby="signup-title"
					>
						<FormBody
							noValidate
							onSubmit={(e: React.FormEvent) => {
								e.preventDefault();
								handleSignupRequest().then();
							}}
						>
							<ModalTitle id="signup-title">Join Wearit</ModalTitle>
							<StyledTextField
								id="signup-email"
								label="Email"
								type="email"
								autoComplete="email"
								inputProps={{ inputMode: 'email' }}
								variant="outlined"
								fullWidth
								value={memberEmail}
								onChange={handleUserEmail}
							/>
							<StyledTextField
								id="signup-phone"
								label="Phone number"
								type="tel"
								autoComplete="tel"
								inputProps={{ inputMode: 'tel' }}
								helperText="Format: 010-1111-1111"
								variant="outlined"
								fullWidth
								value={memberPhone}
								onChange={handlePhone}
							/>
							<StyledTextField
								id="signup-password"
								label="Password"
								autoComplete="new-password"
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
												aria-label="Show or hide password"
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
								autoComplete="new-password"
								error={confirmPassword !== '' && confirmPassword !== memberPassword}
								helperText={
									confirmPassword !== '' && confirmPassword !== memberPassword ? 'Passwords do not match' : ''
								}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="Show or hide password"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												edge="end"
											>
												{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							{formError && <FormError role="alert">{formError}</FormError>}
							<StyledFab variant="extended" color="primary" type="submit" disabled={pending}>
								<LoginIcon sx={{ mr: 1 }} />
								{pending ? 'Creating account…' : 'Create Account'}
							</StyledFab>
						</FormBody>
					</CustomModalContent>
				</CustomModalOverlay>,
				modalRoot,
			)}

			{/* Login modal */}
			{createPortal(
				<CustomModalOverlay $isOpen={loginOpen} onClick={handleLoginClose}>
					<CustomModalContent
						$isOpen={loginOpen}
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-labelledby="login-title"
					>
						<FormBody
							noValidate
							onSubmit={(e: React.FormEvent) => {
								e.preventDefault();
								handleLoginRequest().then();
							}}
						>
							<ModalTitle id="login-title">Welcome Back</ModalTitle>
							<StyledTextField
								id="login-email"
								label="Email"
								type="email"
								autoComplete="email"
								inputProps={{ inputMode: 'email' }}
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
								autoComplete="current-password"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="Show or hide password"
												onClick={() => setShowLoginPassword(!showLoginPassword)}
												edge="end"
											>
												{showLoginPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							{formError && <FormError role="alert">{formError}</FormError>}
							<StyledFab variant="extended" color="primary" type="submit" disabled={pending}>
								<LoginIcon sx={{ mr: 1 }} />
								{pending ? 'Logging in…' : 'Log In'}
							</StyledFab>
						</FormBody>
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
