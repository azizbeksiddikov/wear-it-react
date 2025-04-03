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
	items?: OrderItem[];
}

export interface OrderInput {
	memberId: string;
	orderDate?: Date;
	orderStatus?: OrderStatus;
	orderShippingAddress: string;
	orderSubTotal: number;
	orderShippingCost: number;
	orderTotalAmount?: number;
}

export interface OrderUpdate {
	_id: string;
	orderStatus?: OrderStatus;
	orderShippingAddress?: string;
	orderSubTotal?: number;
	orderShippingCost?: number;
	orderTotalAmount?: number;
}

export interface OrderItem {
	_id: string;
	orderId: string;
	productId: string;
	variantId: string;
	productName: string;
	itemQuantity: number;
	itemUnitPrice: number;
	productCategory: ProductCategory;
	productGender: ProductGender;
	productImage: string;
	size: string;
	color: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItemInput {
	orderId: string;
	productId: string;
	variantId: string;
	itemQuantity: number;
	itemUnitPrice: number;
	size: string;
	color: string;
}
