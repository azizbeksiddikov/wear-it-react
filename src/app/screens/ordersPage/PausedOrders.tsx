import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { OrderCard } from './OrderCard';
import { Order } from '../../../libs/types/order';

export default function PausedOrders() {
	const orders = [];

	return (
		<>
			<Stack className="orders-container">
				{orders.map((order) => (
					<Box key={order._id} className="order-wrapper">
						<OrderCard
							order={order}
							actionButton={
								<Button variant="contained" className="pinterest-button action-btn process-btn" onClick={() => {}}>
									Move to Processing
								</Button>
							}
						/>
					</Box>
				))}

				{orders.length === 0 && (
					<Stack className="empty-orders">
						<Typography variant="body1" className="pinterest-text-secondary">
							You don't have any orders to display.
						</Typography>
					</Stack>
				)}
			</Stack>
		</>
	);
}
