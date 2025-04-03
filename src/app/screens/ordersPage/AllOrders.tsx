import React, { useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { OrderCard } from './OrderCard';
import { Order } from '../../../libs/types/order';
import { OrderStatus } from '../../../libs/enums/order.enum';

interface AllOrdersProps {
	orders: Order[];
	moveToProcess: (orderId: string) => void;
	moveToFinished: (orderId: string) => void;
}

const EmptyState: React.FC = () => (
	<Stack className="empty-orders">
		<Typography variant="body1" className="pinterest-text-secondary">
			You don't have any orders to display.
		</Typography>
	</Stack>
);

const AllOrders: React.FC<AllOrdersProps> = ({ orders, moveToProcess, moveToFinished }) => {
	const ordersContainerRef = useRef<HTMLDivElement | null>(null);

	if (orders.length === 0) {
		return <EmptyState />;
	}

	const pausedOrders = orders.filter((order) => order.orderStatus === OrderStatus.PAUSED);

	return (
		<Stack className="orders-container" ref={ordersContainerRef}>
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

			{pausedOrders.length === 0 && (
				<Typography variant="body1" className="pinterest-text-secondary">
					No paused orders to display.
				</Typography>
			)}
		</Stack>
	);
};

export default AllOrders;
