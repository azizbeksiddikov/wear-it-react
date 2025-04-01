import { createSelector } from 'reselect';
import { AppRootState } from '../../../libs/types/screen';

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrieveFeaturedProducts = createSelector(selectHomePage, (HomePage) => HomePage.featuredProducts);

export const retrieveSaleProducts = createSelector(selectHomePage, (HomePage) => HomePage.saleProducts);
