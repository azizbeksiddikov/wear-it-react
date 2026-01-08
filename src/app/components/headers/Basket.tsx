import React from 'react';
import { Box, Button, Stack, IconButton, Badge, Menu } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useNavigate } from 'react-router-dom';
import { BasketData, CartItem } from '../../../libs/types/search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Messages } from '../../../libs/config';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { useGlobals } from '../../hooks/useGlobals';
import OrderService from '../../services/OrderService';
import '../../../css/components/basket.css';

interface BasketProps {
	cartItems: CartItem[];
	onAdd: (item: CartItem) => void;
	onRemove: (item: CartItem) => void;
	onDelete: (item: CartItem) => void;
	onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
	const { authMember, setOrderBuilder } = useGlobals();
	const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
	const navigate = useNavigate();

	const orderSubTotal = cartItems.reduce((a: number, c: CartItem) => {
		if (c.salePrice) {
			return a + c.salePrice * c.itemQuantity;
		}
		return a + c.itemUnitPrice * c.itemQuantity;
	}, 0);
	const orderShippingCost = orderSubTotal < 50 ? 5 : 0;
	const orderTotalAmount = parseFloat((orderSubTotal + orderShippingCost).toFixed(1));

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const proceedOrderHandler = async () => {
		try {
			handleClose();
			if (!authMember) throw Error(Messages.error2);

			const order = new OrderService();

			const basketData: BasketData = {
				orderItems: cartItems,
				orderSubTotal: orderSubTotal,
				orderShippingCost: orderShippingCost,
				orderTotalAmount: orderTotalAmount,
			};

			await order.createOrder(basketData, 'SEOUL');

			onDeleteAll();
			setOrderBuilder(new Date());

			navigate('/orders');
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};
	return (
		<Box className={'basket'}>
			<IconButton
				aria-label="cart"
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<Badge badgeContent={cartItems.length} color="secondary">
					<LocalMallIcon />
				</Badge>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
						mt: 1.5,
						borderRadius: '16px',
						border: '1px solid #efefef',
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
							border: '1px solid #efefef',
							borderRight: 'none',
							borderBottom: 'none',
						},
						'@media (max-width: 640px)': {
							maxHeight: '85vh',
							mt: 1,
							'&:before': {
								right: 10,
								width: 8,
								height: 8,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Stack className={'basket-frame'}>
					<Box className={'all-check-box'}>
						{cartItems.length === 0 ? (
							<div>Your cart is empty</div>
						) : (
							<>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<LocalMallIcon sx={{ fontSize: 18 }} />
									<span>
										My Bag · {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
									</span>
								</Box>
								<IconButton
									size="small"
									onClick={() => onDeleteAll()}
									sx={{
										color: '#767676',
										'&:hover': {
											color: '#e60023',
											backgroundColor: 'rgba(230, 0, 35, 0.08)',
										},
									}}
								>
									<DeleteOutlineIcon sx={{ fontSize: 20 }} />
								</IconButton>
							</>
						)}
					</Box>

					<Box className={'orders-main-wrapper'}>
						<Box className={'orders-wrapper'}>
							{cartItems.map((item: CartItem) => {
								const imagePath = `${item.productImage}`;
								return (
									<Box className={'basket-info-box'} key={item.variantId}>
										<IconButton
											size="small"
											className={'cancel-btn'}
											onClick={() => onDelete(item)}
											sx={{
												position: 'absolute',
												top: 8,
												right: 8,
												color: '#767676',
												'&:hover': {
													color: '#e60023',
													backgroundColor: 'rgba(230, 0, 35, 0.08)',
												},
											}}
										>
											<CloseIcon sx={{ fontSize: 16 }} />
										</IconButton>
										<img src={imagePath} className={'product-img'} alt={item.productName} />
										<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: 0.5 }}>
											<span className={'product-name'}>{item.productName}</span>
											<p className={'product-price'}>
												${item?.salePrice ?? item.itemUnitPrice} × {item.itemQuantity}
											</p>
										</Box>
										<div className="col-2">
											<button onClick={() => onRemove(item)} className="remove">
												−
											</button>
											<button onClick={() => onAdd(item)} className="add">
												+
											</button>
										</div>
									</Box>
								);
							})}
						</Box>
					</Box>
					{cartItems.length !== 0 ? (
						<Box className={'basket-order'}>
							<Stack spacing={0.8} sx={{ width: '100%' }}>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										fontSize: '14px',
										color: '#767676',
									}}
								>
									<span>Products</span>
									<span style={{ fontWeight: 600, color: '#111111' }}>${orderSubTotal.toFixed(2)}</span>
								</Box>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										fontSize: '14px',
										color: '#767676',
									}}
								>
									<span>Shipping</span>
									<span style={{ fontWeight: 600, color: orderShippingCost === 0 ? '#10b981' : '#111111' }}>
										{orderShippingCost === 0 ? 'FREE' : `$${orderShippingCost.toFixed(2)}`}
									</span>
								</Box>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										fontWeight: 700,
										fontSize: '16px',
										borderTop: '1px solid #efefef',
										pt: 1,
										mt: 0.5,
										color: '#111111',
									}}
								>
									<span>Total</span>
									<span style={{ color: '#e60023' }}>${orderTotalAmount.toFixed(2)}</span>
								</Box>
								{orderSubTotal < 50 && (
									<Box
										sx={{
											fontSize: '11px',
											color: '#767676',
											textAlign: 'center',
											mt: 0.5,
											fontWeight: 500,
										}}
									>
										Add ${(50 - orderSubTotal).toFixed(2)} more for free shipping
									</Box>
								)}
							</Stack>
							<Button
								startIcon={<LocalMallIcon />}
								variant={'contained'}
								onClick={proceedOrderHandler}
								fullWidth
								sx={{
									mt: 1.5,
									py: 1.2,
									fontSize: '15px',
									fontWeight: 600,
									borderRadius: '24px',
									textTransform: 'none',
									boxShadow: 'none',
									'&:hover': {
										boxShadow: 'none',
									},
								}}
							>
								Checkout
							</Button>
						</Box>
					) : (
						<></>
					)}
				</Stack>
			</Menu>
		</Box>
	);
}
