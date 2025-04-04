import { Order } from './order';
import { Product, ProductsOutput } from './product';

/** REACT APP STATE */
export interface AppRootState {
	homePage: HomePageState;
	productsPage: ProductsPageState;
	ordersPage: OrdersPageState;
}

/** HOMEPAGE */
export interface HomePageState {
	featuredProducts: Product[];
	saleProducts: Product[];
}
/** PRODUCTS PAGE */
export interface ProductsPageState {
	chosenProduct: Product | null;
	products: ProductsOutput;
}

/** ORDERS PAGE */
export interface OrdersPageState {
	allOrders: Order[];
	pausedOrders: Order[];
	processOrders: Order[];
	finishedOrders: Order[];
}
