import React, { useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { OrderCard } from './OrderCard';
import { Order } from '../../../libs/types/order';

interface ProcessOrdersProps {
	orders: Order[];
	moveToFinished: (orderId: string) => void;
}

const ProcessOrders: React.FC<ProcessOrdersProps> = ({ orders, moveToFinished }) => {
	const processOrdersRef = useRef<HTMLDivElement>(null);
	return (
		<>
			{orders.length === 0 ? (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any processing orders.
					</Typography>
				</Stack>
			) : (
				<Box className="orders-container" ref={processOrdersRef}>
					{orders.map((order) => (
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
					))}
				</Box>
			)}
		</>
	);
};

export default ProcessOrders;
