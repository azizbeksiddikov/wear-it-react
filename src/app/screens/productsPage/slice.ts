import { createSlice } from '@reduxjs/toolkit';
import { ProductsPageState } from '../../../libs/types/screen';

const initialState: ProductsPageState = {
	chosenProduct: null,
	products: {
		list: [],
		count: {
			total: 0,
		},
	},
};

const productsPageSlice = createSlice({
	name: 'productsPage',
	initialState,
	reducers: {
		setChosenProduct: (state, action) => {
			state.chosenProduct = action.payload;
		},
		setProducts: (state, action) => {
			state.products = action.payload;
		},
	},
});

export const { setChosenProduct, setProducts } = productsPageSlice.actions;

const ProductPageReducer = productsPageSlice.reducer;
export default ProductPageReducer;
