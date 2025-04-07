import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieveAllOrders } from './selector';
import TabPanel from '@mui/lab/TabPanel';

const allOrdersRetriever = createSelector(retrieveAllOrders, (allOrders) => ({ allOrders }));

interface AllOrdersProps {
	setValue: (input: string) => void;
}

export default function AllOrders(props: AllOrdersProps) {
	const { allOrders } = useSelector(allOrdersRetriever);
	const { setValue } = props;

	return (
		<TabPanel value="ALL" className="orders-tab-panel">
			<Stack className="orders-container">
				{allOrders.map((order) => (
					<Box key={order._id} className={'order-wrapper pinterest-card'}>
						<OrderCard order={order} setValue={setValue} />
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
		</TabPanel>
	);
}
