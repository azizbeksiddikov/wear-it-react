import React from 'react';
import { Typography, Button, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverProcessedOrders } from './selector';
import { useGlobals } from '../../hooks/useGlobals';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { OrderStatus } from '../../../libs/enums/order.enum';
import OrderService from '../../services/OrderService';
import { Messages } from '../../../libs/config';
import { T } from '../../../libs/types/common';
import { OrderUpdateInput } from '../../../libs/types/order';

const processedOrdersRetriever = createSelector(retrieverProcessedOrders, (processOrders) => ({ processOrders }));

interface ProcessedOrdersProps {
	setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessedOrdersProps) {
	const { processOrders } = useSelector(processedOrdersRetriever);
	const { authMember, setOrderBuilder } = useGlobals();
	const { setValue } = props;

	/** HANDLER */
	const finishOrderHandler = async (e: T) => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const orderId = e.target.value; // e.currentTarget.value
			const input: OrderUpdateInput = {
				_id: orderId,
				orderStatus: OrderStatus.FINISHED,
			};

			const confirmation = window.confirm('Have you received your order?');
			if (confirmation) {
				const order = new OrderService();
				await order.updateOrder(input);
				setValue(OrderStatus.FINISHED);
				setOrderBuilder(new Date());
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	return (
		<>
			<Stack className="orders-container">
				{processOrders.map((order) => (
					<Stack key={order._id} className={`order-wrapper `}>
						<OrderCard order={order} />
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
		</>
	);
}
