export interface Review {
	_id: string;
	productId: string;
	memberId: string;
	orderId: string;
	rating: number;
	comment?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ReviewInput {
	productId: string;
	orderId: string;
	rating: number;
	comment?: string;
	memberId?: string;
}

export interface ReviewUpdateInput {
	_id: string;
	rating?: number;
	comment?: string;
}
