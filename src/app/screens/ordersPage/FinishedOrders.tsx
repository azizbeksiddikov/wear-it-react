import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { OrderCard } from './OrderCard';
import { Order } from '../../../libs/types/order';

export default function FinishedOrders() {
	const orders = [];
	return (
		<>
			<Stack className="orders-container">
				{orders.map((order) => (
					<Box key={order._id} className={'order-wrapper pinterest-card'}>
						<OrderCard order={order} actionButton={null} />
					</Box>
				))}
			</Stack>

			{orders.length === 0 && (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any orders to display.
					</Typography>
				</Stack>
			)}
		</>
	);
}
