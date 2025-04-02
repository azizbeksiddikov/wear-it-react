import { ProductCategory, ProductGender } from '../enums/product.enum';

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
	// Pagination
	page: number;
	limit: number;

	// Sorting
	sort: 'createdAt' | 'productName' | 'productPrice' | 'popularity' | 'rating';
	order: 'ASC' | 'DESC';

	// Filters
	productCategory?: ProductCategory | ProductCategory[];
	productGender?: ProductGender | ProductGender[];
	isActive?: boolean;
	isFeatured?: boolean;
	onSale?: boolean;

	// Price range
	minPrice?: number;
	maxPrice?: number;

	// In stock only
	inStock?: boolean;

	// Text search
	search?: string;
}
