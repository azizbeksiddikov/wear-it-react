import { Product } from './product';

/** REACT APP STATE */
export interface AppRootState {
	homePage: HomePageState;
}

/** HOMEPAGE */
export interface HomePageState {
	featuredProducts: Product[];
	saleProducts: Product[];
}
/** PRODUCTS PAGE */
/** ORDERS PAGE */
