import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, Button } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import moment from 'moment';
import { Order, OrderItem } from '../../../libs/types/order';
import { T } from '../../../libs/types/common';
import { Messages } from '../../../libs/config';
import OrderService from '../../services/OrderService';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { OrderStatus } from '../../../libs/enums/order.enum';
import { OrderUpdateInput } from '../../../libs/types/order';
import { useGlobals } from '../../hooks/useGlobals';

interface OrderCardProps {
	order: Order;
	setValue: (input: string) => void;
}

export default function OrderCard(props: OrderCardProps) {
	const { authMember, setAuthMember, setOrderBuilder } = useGlobals();
	const { order, setValue } = props;

	/** HANDLERS */
	const deleteOrderHandler = async () => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const input: OrderUpdateInput = {
				_id: order._id,
				orderStatus: OrderStatus.DELETED,
				orderShippingAddress: order.orderShippingAddress,
				orderSubTotal: order.orderSubTotal,
				orderShippingCost: order.orderShippingCost,
				orderTotalAmount: order.orderTotalAmount,
			};

			const confirmation = window.confirm('Do you want to delete this order?');
			if (confirmation) {
				const order = new OrderService();
				await order.updateOrder(input);
				setOrderBuilder(new Date());
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const processOrderHandler = async () => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const input: OrderUpdateInput = {
				_id: order._id,
				orderStatus: OrderStatus.PROCESSING,
				orderShippingAddress: order.orderShippingAddress,
				orderSubTotal: order.orderSubTotal,
				orderShippingCost: order.orderShippingCost,
				orderTotalAmount: order.orderTotalAmount,
			};

			const confirmation = window.confirm('Do you want to proceed with payment?');
			if (confirmation) {
				const order = new OrderService();
				order
					.updateOrder(input)
					.then((data: T) => {
						setAuthMember(data.member);
						localStorage.setItem('memberData', JSON.stringify(data.member));

						setValue(OrderStatus.PROCESSING);
						setOrderBuilder(new Date());
					})
					.catch((err: T) => {
						sweetErrorHandling(err, 2000).then();
					});
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const finishOrderHandler = async () => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const input: OrderUpdateInput = {
				_id: order._id,
				orderStatus: OrderStatus.FINISHED,
				orderShippingAddress: order.orderShippingAddress,
				orderSubTotal: order.orderSubTotal,
				orderShippingCost: order.orderShippingCost,
				orderTotalAmount: order.orderTotalAmount,
			};

			const confirmation = window.confirm('Have you received your order?');
			if (confirmation) {
				const order = new OrderService();
				await order.updateOrder(input);
				setValue(OrderStatus.FINISHED);
				setOrderBuilder(new Date());
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const cancelOrderHandler = async () => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const input: OrderUpdateInput = {
				_id: order._id,
				orderStatus: OrderStatus.CANCELLED,
				orderShippingAddress: order.orderShippingAddress,
				orderSubTotal: order.orderSubTotal,
				orderShippingCost: order.orderShippingCost,
				orderTotalAmount: order.orderTotalAmount,
			};

			const confirmation = window.confirm('Do you want to return this order?');
			if (confirmation) {
				const order = new OrderService();
				order
					.updateOrder(input)
					.then((data: T) => {
						setAuthMember(data.member);
						localStorage.setItem('memberData', JSON.stringify(data.member));

						setValue('ALL');
						setOrderBuilder(new Date());
					})
					.catch((err: T) => {
						sweetErrorHandling(err, 2000).then();
					});
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const statusIcons = {
		PROCESSING: <LocalShippingIcon fontSize="small" />,
		PAUSED: <InventoryIcon fontSize="small" />,
		FINISHED: <CheckCircleIcon fontSize="small" />,
		CANCELLED: <DeleteIcon fontSize="small" />,
	};

	const statusText = {
		PROCESSING: 'Processing',
		PAUSED: 'Paused',
		FINISHED: 'Finished',
		CANCELLED: 'Cancelled',
	};

	const statusColors = {
		PROCESSING: '#dbeafe',
		PAUSED: '#fef3c7',
		FINISHED: '#d1fae5',
		CANCELLED: '#f3e8ff',
	};

	const statusTextColors = {
		PROCESSING: '#1e40af',
		PAUSED: '#92400e',
		FINISHED: '#065f46',
		CANCELLED: '#6b21a8',
		DELETE: '#dc2626',
	};

	return (
		<Card className="order-card " variant="outlined" key={order._id}>
			{/* Card Header */}
			<Box className="card-header">
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent="space-between"
					alignItems={{ xs: 'flex-start', sm: 'center' }}
					p={2}
				>
					<Stack>
						<Typography variant="subtitle1" className="pinterest-text-title">
							Order #{order._id}
						</Typography>
						<Typography variant="caption" className="order-date pinterest-text-secondary">
							Ordered on {moment(order.orderDate).format('MMMM D, YYYY')}
						</Typography>
					</Stack>

					<Stack direction="row" spacing={1} alignItems="center">
						<Chip
							icon={statusIcons[order.orderStatus]}
							label={statusText[order.orderStatus]}
							size="small"
							sx={{
								bgcolor: statusColors[order.orderStatus],
								color: statusTextColors[order.orderStatus],
								fontWeight: 500,
								'& .MuiChip-icon': {
									color: statusTextColors[order.orderStatus],
								},
							}}
						/>
					</Stack>
				</Stack>
			</Box>

			{/* Card Content */}
			<CardContent className="card-content" sx={{ p: 3 }}>
				<Stack spacing={2}>
					<Box>{order._id}</Box>
					{order?.orderItems &&
						order.orderItems.map((item: OrderItem) => {
							return (
								<a key={item._id} href={`/products/${item.productId}`} className="order-item-link">
									<Stack direction="row" spacing={2} alignItems="center" className="order-item-row">
										{/* Image */}
										<Box
											className="item-image-container"
											sx={{
												width: 64,
												height: 64,
												borderRadius: 1,
												overflow: 'hidden',
											}}
										>
											<img src={`${item.productImage}`} alt={item.productName} className="item-image" />
										</Box>

										<Box sx={{ flexGrow: 1 }}>
											<Typography variant="body1" className="pinterest-text-title">
												{item.productName}
											</Typography>
											<div className="item-details">
												{item.productSize && (
													<Typography variant="body2" className="item-detail">
														<span className="detail-label">Size:</span> {item.productSize}
													</Typography>
												)}
												{item.productColor && (
													<Typography variant="body2" className="item-detail">
														<span className="detail-label">Color:</span>
														{item.productColor}
													</Typography>
												)}
												{item.productCategory && (
													<Typography variant="body2" className="item-detail">
														<span className="detail-label">Category:</span> {item.productCategory}
													</Typography>
												)}
												<Typography variant="body2" className="pinterest-text-secondary">
													Qty: {item.itemQuantity}
												</Typography>
											</div>
										</Box>

										<Box sx={{ textAlign: 'right' }}>
											<Stack className="pinterest-text-title price-container">
												{item.salePrice ? (
													<>
														<Typography variant="body2" className="original-price">
															${item.itemUnitPrice.toFixed(2)}
														</Typography>
														<Typography variant="body2" className="sale-price">
															${item.salePrice.toFixed(2)}
														</Typography>
													</>
												) : (
													<Typography variant="body2" className="regular-price">
														${item.itemUnitPrice.toFixed(2)}
													</Typography>
												)}
											</Stack>
										</Box>
									</Stack>
								</a>
							);
						})}
				</Stack>
			</CardContent>

			{/* Card Footer */}
			<Box className="card-footer" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: '#f9f9f9', p: 2 }}>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					justifyContent="space-between"
					alignItems={{ xs: 'flex-start', sm: 'center' }}
					spacing={2}
				>
					<Typography variant="body2" className="pinterest-text-secondary" sx={{ mb: { xs: 2, sm: 0 } }}>
						{order.orderItems.reduce((acc, item) => acc + item.itemQuantity, 0)} items
					</Typography>

					<Stack direction="row" spacing={2} alignItems="center">
						{/* Buttons */}
						<Stack direction="row" spacing={2} alignItems="center">
							{[OrderStatus.PAUSED, OrderStatus.CANCELLED].includes(order.orderStatus) && (
								<Button
									size="small"
									variant="outlined"
									startIcon={<DeleteIcon />}
									value={order._id}
									onClick={deleteOrderHandler}
									sx={{ color: statusTextColors.DELETE, borderColor: statusTextColors.DELETE }}
								>
									Delete
								</Button>
							)}
							{order.orderStatus === OrderStatus.FINISHED && (
								<Button
									size="small"
									variant="outlined"
									startIcon={<DeleteIcon />}
									value={order._id}
									onClick={cancelOrderHandler}
									sx={{ color: statusTextColors.DELETE, borderColor: statusTextColors.DELETE }}
								>
									Cancel
								</Button>
							)}
							{order.orderStatus === OrderStatus.PAUSED && (
								<Button
									size="small"
									variant="outlined"
									startIcon={<PlayArrowIcon />}
									value={order._id}
									onClick={processOrderHandler}
									sx={{ color: statusTextColors.PROCESSING, borderColor: statusTextColors.PROCESSING }}
								>
									Process
								</Button>
							)}
							{order.orderStatus === OrderStatus.PROCESSING && (
								<Button
									size="small"
									variant="outlined"
									startIcon={<DoneIcon />}
									value={order._id}
									onClick={finishOrderHandler}
									sx={{ color: statusTextColors.FINISHED, borderColor: statusTextColors.FINISHED }}
								>
									Finish
								</Button>
							)}
						</Stack>

						<Box sx={{ textAlign: 'right' }}>
							<Typography variant="h6" className="pinterest-text-title">
								${order.orderTotalAmount.toFixed(2)}
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</Box>
		</Card>
	);
}
