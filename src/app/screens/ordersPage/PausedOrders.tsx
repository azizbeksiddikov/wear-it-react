import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useGlobals } from '../../hooks/useGlobals';
import { T } from '../../../libs/types/common';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverPausedOrders } from './selector';
import { OrderUpdateInput } from '../../../libs/types/order';
import { Messages } from '../../../libs/config';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { OrderStatus } from '../../../libs/enums/order.enum';
import OrderService from '../../services/OrderService';

const pausedOrdersRetriever = createSelector(retrieverPausedOrders, (pausedOrders) => ({ pausedOrders }));

interface PausedOrdersProps {
	setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
	const { authMember, setOrderBuilder } = useGlobals();
	const { setValue } = props;

	const { pausedOrders } = useSelector(pausedOrdersRetriever);

	/** HANDLER */
	const deleteOrderHandler = async (e: T) => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const orderId = e.target.value;
			const input: OrderUpdateInput = {
				_id: orderId,
				orderStatus: OrderStatus.DELETED,
			};

			const confirmation = window.confirm('Do you want to delete this order?');
			if (confirmation) {
				const order = new OrderService();
				await order.updateOrder(input);
				setOrderBuilder(new Date()); // refresh order page
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const processOrderHandler = async (e: T) => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const orderId = e.target.value;
			const input: OrderUpdateInput = {
				_id: orderId,
				orderStatus: OrderStatus.PROCESSING,
			};

			const confirmation = window.confirm('Do you want to proceed with payment?');
			if (confirmation) {
				const order = new OrderService();
				await order.updateOrder(input);
				setValue(OrderStatus.PROCESSING);
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
				{pausedOrders.map((order) => (
					<Box key={order._id} className="order-wrapper">
						<OrderCard order={order} />
					</Box>
				))}

				{pausedOrders.length === 0 && (
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
