import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, Button } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import moment from 'moment';
import { Order } from '../../../libs/types/order';
import { OrderStatus } from '../../../libs/enums/order.enum';
import { T } from '../../../libs/types/common';

interface OrderCardProps {
	order: Order;
	deleteOrderHandler?: (e: T) => {};
	processOrderHandler?: (e: T) => {};
	cancelOrderHandler?: (e: T) => {};
	finishOrderHandler?: (e: T) => {};
}

export default function OrderCard(props: OrderCardProps) {
	const { order, deleteOrderHandler, processOrderHandler, cancelOrderHandler, finishOrderHandler } = props;

	const status: OrderStatus = order.orderStatus;

	const statusIcons = {
		PROCESSING: <LocalShippingIcon fontSize="small" />,
		PAUSED: <InventoryIcon fontSize="small" />,
		FINISHED: <CheckCircleIcon fontSize="small" />,
	};

	const statusText = {
		PROCESSING: 'Processing',
		PAUSED: 'Paused',
		FINISHED: 'Finished',
	};

	const statusColors = {
		PROCESSING: '#dbeafe', // blue-100
		PAUSED: '#fef3c7', // amber-100
		FINISHED: '#d1fae5', // green-100
	};

	const statusTextColors = {
		PROCESSING: '#1e40af', // blue-800
		PAUSED: '#92400e', // amber-800
		FINISHED: '#065f46', // green-800
		DELETE: '#dc2626', // red-600
	};

	// Render action buttons based on order status
	const renderActionButtons = () => {
		switch (status) {
			case OrderStatus.PAUSED:
				return (
					<Stack direction="row" spacing={1}>
						{processOrderHandler && (
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
						{deleteOrderHandler && (
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
					</Stack>
				);
			case OrderStatus.PROCESSING:
				return (
					<Stack direction="row" spacing={1}>
						{finishOrderHandler && (
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
						{cancelOrderHandler && (
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
					</Stack>
				);
			case OrderStatus.FINISHED:
				return (
					<Stack direction="row" spacing={1}>
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
					</Stack>
				);
			default:
				return null;
		}
	};

	return (
		<Card className="order-card pinterest-card" variant="outlined">
			{/* Card Header */}
			<Box className="card-header">
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent="space-between"
					alignItems={{ xs: 'flex-start', sm: 'center' }}
					p={2}
				>
					<Box>
						<Typography variant="subtitle1" className="pinterest-text-title">
							Order #{order._id}
						</Typography>
						<Typography variant="caption" className="order-date pinterest-text-secondary">
							Ordered on {moment(order.orderDate).format('MMMM D, YYYY')}
						</Typography>
					</Box>

					<Stack direction="row" spacing={1} alignItems="center">
						<Chip
							icon={statusIcons[status]}
							label={statusText[status]}
							size="small"
							sx={{
								bgcolor: statusColors[status],
								color: statusTextColors[status],
								fontWeight: 500,
								'& .MuiChip-icon': {
									color: statusTextColors[status],
								},
							}}
						/>
					</Stack>
				</Stack>
			</Box>

			{/* Card Content */}
			<CardContent className="card-content" sx={{ p: 3 }}>
				<Stack spacing={2}>
					{order.orderItems.map((item) => (
						<Stack key={item._id} direction="row" spacing={2} alignItems="center" className="order-item-row">
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
								<Typography variant="body2" className="pinterest-text-secondary">
									Qty: {item.itemQuantity}
								</Typography>
							</Box>

							<Box sx={{ textAlign: 'right' }}>
								<Typography variant="body1" className="pinterest-text-title">
									${item.itemUnitPrice.toFixed(2)}
								</Typography>
							</Box>
						</Stack>
					))}
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
						{renderActionButtons()}

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
