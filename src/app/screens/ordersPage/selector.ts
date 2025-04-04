import { createSelector } from 'reselect';
import { AppRootState } from '../../../libs/types/screen';

const selectOrdersPage = (state: AppRootState) => state.ordersPage;

export const retrieveAllOrders = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.allOrders);

export const retrieverPausedOrders = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.pausedOrders);

export const retrieverProcessedOrders = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.processOrders);

export const retrieverFinishedOrders = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.finishedOrders);
