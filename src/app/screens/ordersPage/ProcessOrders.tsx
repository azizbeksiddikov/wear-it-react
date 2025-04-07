import React from 'react';
import { Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import TabPanel from '@mui/lab/TabPanel';
import { OrderStatus } from '../../../libs/enums/order.enum';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverProcessedOrders } from './selector';
import { useSelector } from 'react-redux';

const processedOrdersRetriever = createSelector(retrieverProcessedOrders, (processOrders) => ({ processOrders }));

interface ProcessedOrdersProps {
	setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessedOrdersProps) {
	const { processOrders } = useSelector(processedOrdersRetriever);
	const { setValue } = props;

	return (
		<TabPanel value={OrderStatus.PROCESSING} className="orders-tab-panel">
			<Stack className="orders-container">
				{processOrders.map((order) => (
					<Stack key={order._id} className={`order-wrapper `}>
						<OrderCard order={order} setValue={setValue} />
					</Stack>
				))}
			</Stack>

			{processOrders.length === 0 && (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any orders to display.
					</Typography>
				</Stack>
			)}
		</TabPanel>
	);
}
