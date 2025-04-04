import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Fab, TextField } from '@mui/material';
import styled from 'styled-components';
import LoginIcon from '@mui/icons-material/Login';
import { T } from '../../../libs/types/common';
import { Messages } from '../../../libs/config';
import { LoginInput, MemberInput } from '../../../libs/types/member';
import MemberService from '../../services/MemberService.ts';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { useGlobals } from '../../hooks/useGlobals.ts';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		borderRadius: '16px',
		boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
		padding: theme.spacing(4, 4, 4),
		maxWidth: '400px',
		width: '100%',
		outline: 'none',
	},
}));

const StyledTextField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;

	& .MuiOutlinedInput-root {
		border-radius: 8px;
	}
`;

const StyledFab = styled(Fab)`
	width: 100% !important;
	border-radius: 8px !important;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
	text-transform: none !important;
`;

const ModalTitle = styled.h2`
	font-size: 24px;
	font-weight: 600;
	color: #333;
	margin-bottom: 24px;
	text-align: center;
`;

interface AuthenticationModalProps {
	signupOpen: boolean;
	loginOpen: boolean;
	handleSignupClose: () => void;
	handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
	const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
	const classes = useStyles();
	const [memberEmail, setMemberEmail] = useState('');
	const [memberPhone, setMemberPhone] = useState('');
	const [memberPassword, setMemberPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { setAuthMember } = useGlobals();
	const member = new MemberService();

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

			handleSignupClose();
			await sweetTopSuccessAlert('success', 700);
		} catch (err) {
			handleSignupClose();
			sweetErrorHandling(err).then();
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

			const result = await member.login(loginInput);
			setAuthMember(result);

			handleLoginClose();
			await sweetTopSuccessAlert('success', 700);
		} catch (err) {
			handleLoginClose();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<div>
			{/* Signup modal */}
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={signupOpen}
				onClose={handleSignupClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={signupOpen}>
					<div className={classes.paper}>
						<ModalTitle>Join Wear It</ModalTitle>
						<StyledTextField
							id="outlined-basic"
							label="Email"
							variant="outlined"
							fullWidth
							onChange={handleUserEmail}
						/>
						<StyledTextField
							id="outlined-basic"
							label="Phone number"
							variant="outlined"
							fullWidth
							onChange={handlePhone}
						/>
						<StyledTextField
							id="outlined-basic"
							label="Password"
							variant="outlined"
							type="password"
							fullWidth
							onChange={handlePassword}
							error={memberPassword !== '' && memberPassword.length > 0 && memberPassword.length < 6}
							helperText={
								memberPassword !== '' && memberPassword.length > 0 && memberPassword.length < 6
									? 'Password should be at least 6 characters'
									: ''
							}
						/>
						<StyledTextField
							id="outlined-basic"
							label="Confirm Password"
							variant="outlined"
							type="password"
							fullWidth
							onChange={handleConfirmPassword}
							onKeyDown={handlePasswordKeyDown}
							error={confirmPassword !== '' && confirmPassword !== memberPassword}
							helperText={confirmPassword !== '' && confirmPassword !== memberPassword ? 'Passwords do not match' : ''}
						/>
						<StyledFab variant="extended" color="primary" onClick={handleSignupRequest}>
							<LoginIcon sx={{ mr: 1 }} />
							Create Account
						</StyledFab>
					</div>
				</Fade>
			</Modal>

			{/* Login modal */}
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={loginOpen}
				onClose={handleLoginClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={loginOpen}>
					<div className={classes.paper}>
						<ModalTitle>Welcome Back</ModalTitle>
						<StyledTextField
							id="outlined-basic"
							label="Email"
							variant="outlined"
							fullWidth
							onChange={handleUserEmail}
						/>
						<StyledTextField
							id="outlined-basic"
							label="Password"
							variant="outlined"
							type="password"
							fullWidth
							onChange={handlePassword}
							onKeyDown={handlePasswordKeyDown}
						/>
						<StyledFab variant="extended" color="primary" onClick={handleLoginRequest}>
							<LoginIcon sx={{ mr: 1 }} />
							Log In
						</StyledFab>
					</div>
				</Fade>
			</Modal>
		</div>
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
