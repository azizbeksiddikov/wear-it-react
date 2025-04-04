import { ProductCategory, ProductGender } from '../enums/product.enum';

export interface CartItem {
	productId: string;
	variantId: string;
	productName: string;
	productCategory: ProductCategory;
	productGender: ProductGender;
	productImage: string;
	productSize: string;
	productColor: string;

	itemUnitPrice: number;
	salePrice: number | null;
	itemQuantity: number;
}

export interface BasketData {
	cartItems: CartItem[];
	orderSubTotal: number;
	orderShippingCost: number;
	orderTotalAmount: number;
}
