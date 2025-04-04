import React, { useState } from 'react';
import { Box, Button, Container, IconButton } from '@mui/material';
import { NavLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Basket from './Basket';
import { CartItem } from '../../../libs/types/search';
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
	const [authMember, setAuthMember] = useState(false);

	return (
		<div className="navbar">
			<Container className="navbar-container">
				<NavLink to="/" className="brand-logo">
					<Box>Wear It</Box>
				</NavLink>

				<nav className="nav-links">
					<NavLink exact to="/">
						Home
					</NavLink>
					<NavLink to="/products">Products</NavLink>
					{authMember && <NavLink to="/orders">Orders</NavLink>}
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
							<NavLink to="/my-page">
								<IconButton>
									<PersonIcon />
								</IconButton>
							</NavLink>
							<Button variant="outlined" startIcon={<LogoutIcon />} onClick={() => setAuthMember(false)}>
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
