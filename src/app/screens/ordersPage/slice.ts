import { createSlice } from '@reduxjs/toolkit';
import { OrdersPageState } from '../../../libs/types/screen';

const initialState: OrdersPageState = {
	allOrders: [],
	pausedOrders: [],
	processOrders: [],
	finishedOrders: [],
};

const ordersPageSlice = createSlice({
	name: 'ordersPage',
	initialState,
	reducers: {
		setAllOrders: (state, action) => {
			state.allOrders = action.payload;
		},
		setPausedOrders: (state, action) => {
			state.pausedOrders = action.payload;
		},
		setProcessOrders: (state, action) => {
			state.processOrders = action.payload;
		},
		setFinishedOrders: (state, action) => {
			state.finishedOrders = action.payload;
		},
	},
});

export const { setAllOrders, setPausedOrders, setProcessOrders, setFinishedOrders } = ordersPageSlice.actions;

const OrdersPageReducer = ordersPageSlice.reducer;
export default OrdersPageReducer;
