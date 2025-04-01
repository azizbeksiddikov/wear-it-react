import { Product } from './product';

/** REACT APP STATE */
export interface AppRootInterface {
	homePage: HomePageState;
}

/** HOMEPAGE */
export interface HomePageState {
	featureProducts: Product[];
	saleProducts: Product[];
}
/** PRODUCTS PAGE */
/** ORDERS PAGE */
