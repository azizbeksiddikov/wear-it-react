import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import TabPanel from '@mui/lab/TabPanel';
import { OrderStatus } from '../../../libs/enums/order.enum';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverFinishedOrders } from './selector';
import { useSelector } from 'react-redux';

const finishedOrdersRetriever = createSelector(retrieverFinishedOrders, (finishedOrders) => ({ finishedOrders }));

interface FinishedOrdersProps {
	setValue: (input: string) => void;
}
export default function FinishedOrders(props: FinishedOrdersProps) {
	const { finishedOrders } = useSelector(finishedOrdersRetriever);
	const { setValue } = props;

	return (
		<TabPanel value={OrderStatus.FINISHED} className="order-tab-panel">
			<Stack className="orders-container">
				{finishedOrders.map((order) => (
					<Box key={order._id} className={'order-wrapper pinterest-card'}>
						<OrderCard order={order} setValue={setValue} />
					</Box>
				))}
			</Stack>

			{finishedOrders.length === 0 && (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any orders to display.
					</Typography>
				</Stack>
			)}
		</TabPanel>
	);
}
