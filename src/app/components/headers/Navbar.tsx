import React from 'react';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Basket from './Basket';
import { CartItem } from '../../../libs/types/search';
import { Avatar, Box, Button, Container, IconButton } from '@mui/material';
import { useGlobals } from '../../hooks/useGlobals';
import MemberService from '../../services/MemberService';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { Messages } from '../../../libs/config';
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
		try {
			await new MemberService().logout();
			setAuthMember(null);

			await sweetTopSuccessAlert('success', 700);
		} catch (err) {
			console.log(err);
			sweetErrorHandling(Messages.error1);
		}
	};

	return (
		<div className="navbar">
			<Container className="navbar-container">
				<Link to="/" className="brand-logo">
					<Box>Wear It</Box>
				</Link>

				<nav className="nav-links">
					<Link to="/">Home</Link>
					<Link to="/products">Products</Link>
					{authMember && <Link to="/orders">Orders</Link>}
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
							<Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogoutRequest}>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button variant="outlined" startIcon={<LoginIcon />} onClick={() => setLoginOpen(true)}>
								Login
							</Button>
							<Button variant="contained" onClick={() => setSignupOpen(true)}>
								Sign Up
							</Button>
						</>
					)}
				</div>
			</Container>
		</div>
	);
}
