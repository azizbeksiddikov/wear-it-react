import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Basket from './Basket';
import { CartItem } from '../../../libs/types/search';
import { Avatar, Box, Button, Container, IconButton } from '@mui/material';
import { useGlobals } from '../../hooks/useGlobals';
import MemberService from '../../services/MemberService';
import { sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import '../../../css/components/navbar.css';

interface NavbarProps {
	cartItems: CartItem[];
	onAdd: (item: CartItem) => void;
	onRemove: (item: CartItem) => void;
	onDelete: (item: CartItem) => void;
	onDeleteAll: () => void;
	setSignupOpen: (isOpen: boolean) => void;
	setLoginOpen: (isOpen: boolean) => void;
}

export default function Navbar(props: NavbarProps) {
	const { cartItems, onAdd, onRemove, onDelete, onDeleteAll, setSignupOpen, setLoginOpen } = props;
	const { authMember, setAuthMember } = useGlobals();

	const handleLogoutRequest = async () => {
		// Always clear auth state and local storage, regardless of API response
		setAuthMember(null);
		localStorage.removeItem('memberData');

		// Try to call logout API (but don't fail if it errors)
		try {
			await new MemberService().logout();
		} catch (err) {
			// Log but don't show error to user - state is already cleared
			console.log('Logout API error (state already cleared):', err);
		}

		// Show success message
		await sweetTopSuccessAlert('success', 1400);
	};

	return (
		<div className="navbar">
			<Container className="navbar-container">
				<Link to="/" className="brand-logo">
					<Box>Wear It</Box>
				</Link>

				<nav className="nav-links">
					<NavLink to="/" end>
						Home
					</NavLink>
					<NavLink to="/products">Products</NavLink>
					{authMember && <NavLink to="/orders">Orders</NavLink>}
					<NavLink to="/help">Help</NavLink>
				</nav>

				<div className="auth-section">
					{authMember ? (
						<>
							<Basket
								cartItems={cartItems}
								onAdd={onAdd}
								onRemove={onRemove}
								onDelete={onDelete}
								onDeleteAll={onDeleteAll}
							/>
							<Link to="/my-page">
								<IconButton>
									{authMember?.memberImage ? (
										<Avatar src={authMember.memberImage} alt={authMember.memberFullName || 'Profile'} />
									) : (
										<Avatar>
											<PersonIcon />
										</Avatar>
									)}
								</IconButton>
							</Link>
							<Button
								variant="outlined"
								startIcon={<LogoutIcon />}
								onClick={(e) => {
									handleLogoutRequest();
									(e.currentTarget as HTMLButtonElement).blur();
								}}
							>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button
								variant="outlined"
								startIcon={<LoginIcon />}
								onClick={(e) => {
									setLoginOpen(true);
									(e.currentTarget as HTMLButtonElement).blur();
								}}
							>
								Login
							</Button>
							<Button
								variant="contained"
								onClick={(e) => {
									setSignupOpen(true);
									(e.currentTarget as HTMLButtonElement).blur();
								}}
							>
								Sign Up
							</Button>
						</>
					)}
				</div>
			</Container>
		</div>
	);
}
