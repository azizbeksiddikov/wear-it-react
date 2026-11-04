import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Basket from './Basket';
import { CartItem } from '../../../libs/types/search';
import { Avatar, Box, Button, Container, Drawer, IconButton } from '@mui/material';
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
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = () => setMenuOpen(false);

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
		await sweetTopSuccessAlert('You are logged out', 1400);
	};

	return (
		<div className="navbar">
			<Container className="navbar-container">
				<Link to="/" className="brand-logo">
					<Box>Wearit</Box>
				</Link>

				<nav className="nav-links" aria-label="Main">
					<NavLink to="/" end>
						Home
					</NavLink>
					<NavLink to="/products">Products</NavLink>
					{authMember && <NavLink to="/orders">Orders</NavLink>}
					<NavLink to="/help">Help</NavLink>
				</nav>

				<div className="auth-section">
					{/* Phone-only quick actions: cart (when signed in), account, menu */}
					{authMember ? (
						<>
							<Basket
								cartItems={cartItems}
								onAdd={onAdd}
								onRemove={onRemove}
								onDelete={onDelete}
								onDeleteAll={onDeleteAll}
							/>
							<IconButton component={Link} to="/my-page" className="desktop-only" aria-label="My page">
								{authMember?.memberImage ? (
									<Avatar src={authMember.memberImage} alt="" />
								) : (
									<Avatar>
										<PersonIcon />
									</Avatar>
								)}
							</IconButton>
							<Button
								className="desktop-only"
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
								className="desktop-only"
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
								className="desktop-only"
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
					{authMember ? (
						<IconButton component={Link} to="/my-page" className="nav-icon-btn mobile-only" aria-label="My page">
							{authMember?.memberImage ? (
								<Avatar src={authMember.memberImage} alt="" sx={{ width: 28, height: 28 }} />
							) : (
								<PersonOutlineIcon />
							)}
						</IconButton>
					) : (
						<IconButton className="nav-icon-btn mobile-only" aria-label="Log in" onClick={() => setLoginOpen(true)}>
							<PersonOutlineIcon />
						</IconButton>
					)}
					<IconButton className="nav-icon-btn mobile-only" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
						<MenuIcon />
					</IconButton>
				</div>
			</Container>

			<Drawer
				anchor="right"
				open={menuOpen}
				onClose={closeMenu}
				className="nav-drawer"
				PaperProps={{ className: 'nav-drawer-paper' }}
			>
				<div className="nav-drawer-head">
					<span className="brand-logo">Wearit</span>
					<IconButton aria-label="Close menu" onClick={closeMenu} sx={{ width: 44, height: 44 }}>
						<CloseIcon />
					</IconButton>
				</div>
				<nav className="nav-drawer-links" aria-label="Menu">
					<NavLink to="/" end onClick={closeMenu}>
						Home
					</NavLink>
					<NavLink to="/products" onClick={closeMenu}>
						Products
					</NavLink>
					{authMember && (
						<NavLink to="/orders" onClick={closeMenu}>
							Orders
						</NavLink>
					)}
					{authMember && (
						<NavLink to="/my-page" onClick={closeMenu}>
							My page
						</NavLink>
					)}
					<NavLink to="/help" onClick={closeMenu}>
						Help
					</NavLink>
				</nav>
				<div className="nav-drawer-actions">
					{authMember ? (
						<Button
							variant="outlined"
							startIcon={<LogoutIcon />}
							onClick={() => {
								closeMenu();
								handleLogoutRequest();
							}}
						>
							Logout
						</Button>
					) : (
						<>
							<Button
								variant="contained"
								onClick={() => {
									closeMenu();
									setSignupOpen(true);
								}}
							>
								Sign Up
							</Button>
							<Button
								variant="outlined"
								startIcon={<LoginIcon />}
								onClick={() => {
									closeMenu();
									setLoginOpen(true);
								}}
							>
								Login
							</Button>
						</>
					)}
				</div>
			</Drawer>
		</div>
	);
}
