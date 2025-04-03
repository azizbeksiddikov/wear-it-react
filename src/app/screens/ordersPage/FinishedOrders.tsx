import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { OrderCard } from './OrderCard';
import { Order } from '../../../libs/types/order';

interface FinishedOrdersProps {
	orders: Order[];
}

const FinishedOrders: React.FC<FinishedOrdersProps> = ({ orders }) => {
	return (
		<>
			{orders.length === 0 ? (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any completed orders.
					</Typography>
				</Stack>
			) : (
				<Stack className="orders-container">
					{orders.map((order) => (
						<Box key={order._id} className={'order-wrapper pinterest-card'}>
							<OrderCard order={order} actionButton={null} />
						</Box>
					))}
				</Stack>
			)}
		</>
	);
};

export default FinishedOrders;
