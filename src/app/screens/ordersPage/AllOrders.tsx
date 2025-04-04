import React, { useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { OrderCard } from './OrderCard';
import { Order } from '../../../libs/types/order';
import { OrderStatus } from '../../../libs/enums/order.enum';

export default function AllOrders() {
	const orders = [];

	return (
		<Stack className="orders-container">
			{orders.map((order) => {
				if (order.orderStatus === OrderStatus.PAUSED) {
					return (
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
					);
				} else if (order.orderStatus === OrderStatus.PROCESSING) {
					return (
						<Stack key={order._id} className={`order-wrapper `}>
							<OrderCard
								order={order}
								actionButton={
									<Button
										variant="contained"
										className="pinterest-button action-btn finished-btn"
										onClick={() => moveToFinished(order._id)}
									>
										Mark as Completed
									</Button>
								}
							/>
						</Stack>
					);
				} else if (order.orderStatus === OrderStatus.FINISHED) {
					<Stack className="orders-container">
						{orders.map((order) => (
							<Box key={order._id} className={'order-wrapper pinterest-card'}>
								<OrderCard order={order} actionButton={null} />
							</Box>
						))}
					</Stack>;
				}

				return null;
			})}

			{orders.length === 0 && (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any orders to display.
					</Typography>
				</Stack>
			)}
		</Stack>
	);
}
