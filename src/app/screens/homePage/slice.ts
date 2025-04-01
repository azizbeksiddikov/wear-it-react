import { createSlice } from '@reduxjs/toolkit';
import { HomePageState } from '../../../libs/types/screen';

const initialState: HomePageState = {
	featuredProducts: [],
	saleProducts: [],
};

const homePageSlice = createSlice({
	name: 'homePage',
	initialState,
	reducers: {
		setFeaturedProducts: (state, action) => {
			state.featuredProducts = action.payload;
		},
		setSaleProducts: (state, action) => {
			state.saleProducts = action.payload;
		},
	},
});

export const { setFeaturedProducts, setSaleProducts } = homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;
