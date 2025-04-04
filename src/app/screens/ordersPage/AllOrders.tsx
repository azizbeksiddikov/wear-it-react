import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieveAllOrders } from './selector';
import { T } from '../../../libs/types/common';

const allOrdersRetriever = createSelector(retrieveAllOrders, (allOrders) => ({ allOrders }));

interface ProcessedOrdersProps {
	deleteOrderHandler: (e: T) => {};
	processOrderHandler: (e: T) => {};
	cancelOrderHandler: (e: T) => {};
	finishOrderHandler: (e: T) => {};
}

export default function AllOrders(props: ProcessedOrdersProps) {
	const { allOrders } = useSelector(allOrdersRetriever);
	const { deleteOrderHandler, processOrderHandler, cancelOrderHandler, finishOrderHandler } = props;

	return (
		<>
			<Stack className="orders-container">
				{allOrders.map((order) => (
					<Box key={order._id} className={'order-wrapper pinterest-card'}>
						<OrderCard
							order={order}
							deleteOrderHandler={deleteOrderHandler}
							processOrderHandler={processOrderHandler}
							cancelOrderHandler={cancelOrderHandler}
							finishOrderHandler={finishOrderHandler}
						/>
					</Box>
				))}
			</Stack>

			{allOrders.length === 0 && (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any orders to display.
					</Typography>
				</Stack>
			)}
		</>
	);
}
// return (
// 		<Stack className="orders-container">
// 			{orders.map((order) => {
// 				if (order.orderStatus === OrderStatus.PAUSED) {
// 					return (
// 						<Stack className="orders-container">
// 							{orders.map((order) => (
// 								<Box key={order._id} className="order-wrapper">
// 									<OrderCard
// 										order={order}
// 										actionButton={
// 											<Button
// 												variant="contained"
// 												className="pinterest-button action-btn process-btn"
// 												onClick={() => moveToProcess(order._id)}
// 											>
// 												Move to Processing
// 											</Button>
// 										}
// 									/>
// 								</Box>
// 							))}
// 						</Stack>
// 					);
// 				} else if (order.orderStatus === OrderStatus.PROCESSING) {
// 					return (
// 						<Stack key={order._id} className={`order-wrapper `}>
// 							<OrderCard
// 								order={order}
// 								actionButton={
// 									<Button
// 										variant="contained"
// 										className="pinterest-button action-btn finished-btn"
// 										onClick={() => moveToFinished(order._id)}
// 									>
// 										Mark as Completed
// 									</Button>
// 								}
// 							/>
// 						</Stack>
// 					);
// 				} else if (order.orderStatus === OrderStatus.FINISHED) {
// 					<Stack className="orders-container">
// 						{orders.map((order) => (
// 							<Box key={order._id} className={'order-wrapper pinterest-card'}>
// 								<OrderCard order={order} actionButton={null} />
// 							</Box>
// 						))}
// 					</Stack>;
// 				}

// 				return null;
// 			})}

// 			{orders.length === 0 && (
// 				<Stack className="empty-orders">
// 					<Typography variant="body1" className="pinterest-text-secondary">
// 						You don't have any orders to display.
// 					</Typography>
// 				</Stack>
// 			)}
// 		</Stack>
// 	);
