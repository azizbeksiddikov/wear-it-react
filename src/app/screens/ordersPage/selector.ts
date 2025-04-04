import { createSelector } from 'reselect';
import { AppRootState } from '../../../libs/types/screen';

const selectOrdersPage = (state: AppRootState) => state.ordersPage;

export const retrieveAllOrders = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.allOrders);

export const retrievePopularDishes = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.pausedOrders);

export const retrieveNewDishes = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.processOrders);

export const retrieveTopUsers = createSelector(selectOrdersPage, (OrdersPage) => OrdersPage.finishedOrders);
