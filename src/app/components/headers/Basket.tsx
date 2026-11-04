import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Badge, Box, Button, IconButton, Menu, Stack } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../css/components/basket.css';
import { Messages } from '../../../libs/config';
import { getErrorCode } from '../../../libs/errorMessages';
import { IMAGE_PLACEHOLDER, handleImageError } from '../../../libs/image';
import { pointsMissing, shippingAddressOf } from '../../../libs/points';
import { sweetAskForAddress, sweetAskForPoints, sweetConfirm, sweetErrorHandling } from '../../../libs/sweetAlert';
import { BasketData, CartItem } from '../../../libs/types/search';
import { useGlobals } from '../../hooks/useGlobals';
import OrderService from '../../services/OrderService';

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
	const [placingOrder, setPlacingOrder] = React.useState(false);
	const open = Boolean(anchorEl);
	const missingPoints = authMember ? pointsMissing(authMember.memberPoints, orderTotalAmount) : 0;
	const itemCount = cartItems.reduce((a: number, c: CartItem) => a + c.itemQuantity, 0);

	/** HANDLERS **/
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const emptyBasketHandler = async () => {
		if (await sweetConfirm('Empty your basket?', 'Empty basket')) onDeleteAll();
	};
	const proceedOrderHandler = async () => {
		if (placingOrder) return; // a double tap must not place two orders
		try {
			handleClose();
			if (!authMember) throw Error(Messages.error2);

			// Ship to the saved address. Without one, do not call the API: send the shopper to the profile.
			const address = shippingAddressOf(authMember);
			if (!address) {
				if (await sweetAskForAddress()) navigate('/my-page');
				return;
			}

			setPlacingOrder(true);
			const order = new OrderService();

			const basketData: BasketData = {
				orderItems: cartItems,
				orderSubTotal: orderSubTotal,
				orderShippingCost: orderShippingCost,
				orderTotalAmount: orderTotalAmount,
			};

			await order.createOrder(basketData, address);

			onDeleteAll();
			setOrderBuilder(new Date());

			navigate('/orders');
		} catch (err) {
			console.log(err);
			if (getErrorCode(err) === 'NOT_ENOUGH_POINTS') {
				const missing = pointsMissing(authMember?.memberPoints ?? 0, orderTotalAmount);
				if (await sweetAskForPoints(missing)) navigate('/my-page#balance');
			} else {
				sweetErrorHandling(err).then();
			}
		} finally {
			setPlacingOrder(false);
		}
	};
	return (
		<Box className={'basket'}>
			<IconButton
				aria-label={`Basket, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
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
							<div>Your basket is empty</div>
						) : (
							<>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<LocalMallIcon sx={{ fontSize: 18 }} />
									<span>
										My Bag · {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
									</span>
								</Box>
								<IconButton
									onClick={emptyBasketHandler}
									aria-label="Empty basket"
									sx={{
										width: 44,
										height: 44,
										color: '#6b6b6b',
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
								const imagePath = item.productImage || IMAGE_PLACEHOLDER;
								return (
									<Box className={'basket-info-box'} key={item.variantId}>
										<img
											src={imagePath}
											className={'product-img'}
											alt={item.productName}
											loading="lazy"
											onError={handleImageError}
										/>
										<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: 0.5 }}>
											<span className={'product-name'}>{item.productName}</span>
											<p className={'product-price'}>
												${item?.salePrice ?? item.itemUnitPrice} × {item.itemQuantity}
											</p>
											<div className="col-2" role="group" aria-label={`Quantity of ${item.productName}`}>
												<button
													type="button"
													onClick={() => onRemove(item)}
													className="remove"
													aria-label={`Decrease quantity of ${item.productName}`}
												>
													−
												</button>
												<span className="qty" aria-live="polite">
													{item.itemQuantity}
												</span>
												<button
													type="button"
													onClick={() => onAdd(item)}
													className="add"
													aria-label={`Increase quantity of ${item.productName}`}
												>
													+
												</button>
											</div>
										</Box>
										<IconButton
											className={'cancel-btn'}
											onClick={() => onDelete(item)}
											aria-label={`Remove ${item.productName} from basket`}
											sx={{
												alignSelf: 'flex-start',
												width: 44,
												height: 44,
												color: '#6b6b6b',
												'&:hover': {
													color: '#e60023',
													backgroundColor: 'rgba(230, 0, 35, 0.08)',
												},
											}}
										>
											<CloseIcon sx={{ fontSize: 18 }} />
										</IconButton>
									</Box>
								);
							})}
						</Box>
					</Box>
					{cartItems.length === 0 && (
						<Box sx={{ p: 2 }}>
							<Button component={Link} to="/products" variant="contained" fullWidth onClick={handleClose}>
								Browse products
							</Button>
						</Box>
					)}
					{cartItems.length !== 0 ? (
						<Box className={'basket-order'}>
							<Stack spacing={0.8} sx={{ width: '100%' }}>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										fontSize: '14px',
										color: '#6b6b6b',
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
										color: '#6b6b6b',
									}}
								>
									<span>Shipping</span>
									<span style={{ fontWeight: 600, color: orderShippingCost === 0 ? '#047857' : '#111111' }}>
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
											fontSize: '12px',
											color: '#6b6b6b',
											textAlign: 'center',
											mt: 0.5,
											fontWeight: 500,
										}}
									>
										Add ${(50 - orderSubTotal).toFixed(2)} more for free shipping
									</Box>
								)}
								{authMember && missingPoints > 0 && (
									<Box
										role="note"
										sx={{
											fontSize: '13px',
											color: '#555555',
											textAlign: 'center',
											mt: 0.5,
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}
									>
										<span>
											You have {authMember.memberPoints.toLocaleString('en-US')} points. Paying needs{' '}
											{missingPoints.toLocaleString('en-US')} more.
										</span>
										<Button
											component={Link}
											to="/my-page#balance"
											onClick={handleClose}
											size="small"
											sx={{ minHeight: 44, textTransform: 'none', fontWeight: 600, fontSize: '14px' }}
										>
											Add points
										</Button>
									</Box>
								)}
							</Stack>
							<Button
								startIcon={<LocalMallIcon />}
								variant={'contained'}
								onClick={proceedOrderHandler}
								disabled={placingOrder}
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
								{placingOrder ? 'Placing order…' : 'Checkout'}
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
