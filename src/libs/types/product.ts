import { ProductCategory, ProductGender } from '../enums/product.enum';
import { Direction } from '../enums/common.enum';
import { Review } from './review';

export interface Product {
	_id: string;
	productName: string;
	productCategory: ProductCategory;
	productGender: ProductGender;
	productDesc?: string;
	productImages: string[];
	isActive: boolean;
	isFeatured: boolean;
	onSale: boolean;
	productViews: number;
	createdAt: Date;
	updatedAt: Date;
	reviewsCount: number;
	reviewsRating: number;

	productVariants?: ProductVariant[];
	productReviews?: Review[];
	memberReview?: Review;
	isReviewValid?: boolean;
	cheapestProductVariant?: ProductVariant;
}

export interface ProductInput {
	productName: string;
	productCategory: ProductCategory;
	productGender: ProductGender;
	productDesc?: string;
	productImages: string[];
}

export interface ProductVariant {
	_id: string;
	productId: string;
	size: string;
	color: string;
	productPrice: number;
	stockQuantity: number;
	salePrice?: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductVariantInput {
	productId: string;
	size: string;
	color: string;
	productPrice: number;
	salePrice?: number;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	direction: Direction;
	productCategory?: ProductCategory;
	productGender?: ProductGender;
	isFeatured: boolean;
	onSale: boolean;
	search?: string;
}

export interface TotalCounter {
	total?: number;
}

export interface ProductsOutput {
	list: Product[];
	count: TotalCounter;
}
