import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Fab, Stack, TextField } from '@mui/material';
import styled from 'styled-components';
import LoginIcon from '@mui/icons-material/Login';
import { T } from '../../../libs/types/common';
import { Messages } from '../../../libs/config';
import { LoginInput, MemberInput } from '../../../libs/types/member';
import MemberService from '../../services/MemberService.ts';
import { sweetErrorHandling } from '../../../libs/sweetAlert';

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

	/** HANDLERS **/

	const handleUserEmail = (e: T) => {
		setMemberEmail(e.target.value);
	};
	const handlePhone = (e: T) => {
		setMemberPhone(e.target.value);
	};
	const handlePassword = (e: T) => {
		setMemberPassword(e.target.value);
	};

	// signup when pressed "enter" key
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

	// signup request
	const handleSignupRequest = async () => {
		try {
			const isFulFill = memberEmail !== '' && memberPhone !== '' && memberPassword !== '';

			if (!isFulFill) throw new Error(Messages.error3);

			const signupInput: MemberInput = {
				memberEmail: memberEmail,
				memberPhone: memberPhone,
				memberPassword: memberPassword,
			};

			const member = new MemberService();
			await member.signup(signupInput);
			// Saving Authenticated User

			handleSignupClose();
		} catch (err) {
			console.log('fashdiah', err);
			handleSignupClose();
			sweetErrorHandling(err).then();
		}
	};

	const handleLoginRequest = async () => {
		try {
			const isFulFill = memberEmail !== '' && memberPassword !== '';
			if (!isFulFill) throw new Error(Messages.error3);

			const loginInput: LoginInput = {
				memberEmail: memberEmail,
				memberPassword: memberPassword,
			};

			const member = new MemberService();
			await member.login(loginInput);
			handleLoginClose();
		} catch (err) {
			console.log('fashdiah', err);
			handleLoginClose();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<div>
			{/* signup modal */}
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
							onKeyDown={handlePasswordKeyDown}
						/>
						<StyledFab variant="extended" color="primary" onClick={handleSignupRequest}>
							<LoginIcon sx={{ mr: 1 }} />
							Create Account
						</StyledFab>
					</div>
				</Fade>
			</Modal>

			{/* login modal */}
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
