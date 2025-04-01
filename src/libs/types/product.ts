import { ProductCategory, ProductGender } from '../enums/product.enum';

export interface ProductVariant {
	_id: string;
	productId: string; // Product
	size: string;
	color: string;
	stockQuantity: number;
	productPrice: number;
	salePrice?: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductVariantInput {
	productId: string;
	size: string;
	color: string;
	stockQuantity: number;
	productPrice: number;
	salePrice?: number;
}

export interface ProductVariantUpdate {
	_id: string;
	size?: string;
	color?: string;
	stockQuantity?: number;
	productPrice?: number;
	salePrice?: number;
}

export interface Product {
	_id: string;
	productName: string;
	productCategory: ProductCategory;
	productGender: ProductGender;
	productDesc?: string;
	productImages?: string[];
	isActive: boolean;
	isFeatured: boolean;
	onSale: boolean;
	createdAt: Date;
	updatedAt: Date;

	productVariants?: ProductVariant[];
}

export interface ProductInput {
	productName: string;
	productCategory: ProductCategory;
	productGender: ProductGender;
	productDesc?: string;
	productImages?: string[];
}

export interface ProductUpdateInput {
	_id: string;
	productName?: string;
	productCategory?: ProductCategory;
	productGender?: ProductGender;
	productDesc?: string;
	productImages?: string[];
	isActive?: boolean;
	isFeatured?: boolean;
	onSale?: boolean;
}

export interface ProductInquiry {
	page: number;
	limit: number;
	sort: 'cretedAt' | 'productName' | 'productPrice';
	order: ['ASC', 'DESC'];
	productCategory?: ProductCategory;
	productGender?: ProductGender;
	isActive?: boolean;
	isFeatured?: boolean;
	onSale?: boolean;
	search?: string;
}
