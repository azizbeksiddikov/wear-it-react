import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useHistory } from 'react-router-dom';
import { BasketData, CartItem } from '../../../libs/types/search';
import DeletForeverIcon from '@mui/icons-material/DeleteForever';
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
	const history = useHistory();

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

			history.push('/orders');
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
					<ShoppingCartIcon />
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
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
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
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Stack className={'basket-frame'}>
					<Box className={'all-check-box'}>
						{cartItems.length === 0 ? (
							<div>Cart is empty!</div>
						) : (
							<Stack flexDirection={'row'}>
								<div>Cart products:</div>
								<DeletForeverIcon
									sx={{ ml: '5px', cursor: 'pointer' }}
									color={'primary'}
									onClick={() => onDeleteAll()}
								/>
							</Stack>
						)}
					</Box>

					<Box className={'orders-main-wrapper'}>
						<Box className={'orders-wrapper'}>
							{cartItems.map((item: CartItem) => {
								const imagePath = `${item.productImage}`;
								return (
									<Box className={'basket-info-box'} key={item.variantId}>
										<div className={'cancel-btn'}>
											<CancelIcon color={'primary'} onClick={() => onDelete(item)} />
										</div>
										<img src={imagePath} className={'product-img'} alt="productImage" />
										<span className={'product-name'}>{item.productName}</span>
										<p className={'product-price'}>
											${item?.salePrice ?? item.itemUnitPrice} x {item.itemQuantity}
										</p>
										<Box sx={{ minWidth: 120 }}>
											<div className="col-2">
												<button onClick={() => onRemove(item)} className="remove">
													-
												</button>
												<button onClick={() => onAdd(item)} className="add">
													+
												</button>
											</div>
										</Box>
									</Box>
								);
							})}
						</Box>
					</Box>
					{cartItems.length !== 0 ? (
						<Box className={'basket-order'}>
							<span className={'price'}>
								Total: ${orderTotalAmount} ({orderSubTotal} + {orderShippingCost})
							</span>
							<Button startIcon={<ShoppingCartIcon />} variant={'contained'} onClick={proceedOrderHandler}>
								Order
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
