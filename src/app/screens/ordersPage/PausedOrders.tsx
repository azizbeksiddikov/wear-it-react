import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { OrderCard } from './OrderCard';
import { Order } from '../../../libs/types/order';

interface PausedOrdersProps {
	orders: Order[];
	moveToProcess: (orderId: string) => void;
}

const PausedOrders: React.FC<PausedOrdersProps> = ({ orders, moveToProcess }) => {
	return (
		<>
			{orders.length === 0 ? (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any paused orders.
					</Typography>
				</Stack>
			) : (
				<Stack className="orders-container">
					{orders.map((order) => (
						<Box key={order._id} className="order-wrapper">
							<OrderCard
								order={order}
								actionButton={
									<Button
										variant="contained"
										className="pinterest-button action-btn process-btn"
										onClick={() => moveToProcess(order._id)}
									>
										Move to Processing
									</Button>
								}
							/>
						</Box>
					))}
				</Stack>
			)}
		</>
	);
};

export default PausedOrders;
