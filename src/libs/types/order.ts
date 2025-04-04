import { OrderStatus } from '../enums/order.enum';
import { ProductCategory, ProductGender } from '../enums/product.enum';

export interface Order {
	_id: string;
	memberId: string;
	orderDate: Date;
	orderStatus: OrderStatus;
	orderShippingAddress: string;
	orderSubTotal: number;
	orderShippingCost: number;
	orderTotalAmount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderInput {
	memberId: string;
	orderShippingAddress: string;
	orderSubTotal: number;
	orderShippingCost: number;
	orderTotalAmount: number;

	orderItems: OrderItemInput[];
}

export interface OrderUpdateInput {
	_id: string;
	orderStatus?: OrderStatus;
	// orderShippingAddress?: string;
	// orderSubTotal?: number;
	// orderShippingCost?: number;
	// orderTotalAmount?: number;
}

export interface OrderItem {
	_id: string;
	orderId: string;
	productId: string;
	variantId: string;
	productName: string;
	productCategory: ProductCategory;
	productGender: ProductGender;
	productImage: string;
	productSize: string;
	productColor: string;
	itemUnitPrice: number;
	salePrice?: number;
	itemQuantity: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItemInput {
	orderId?: string;

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

export interface OrderInquiry {
	page: number;
	limit: number;
	orderStatus?: OrderStatus;
}
