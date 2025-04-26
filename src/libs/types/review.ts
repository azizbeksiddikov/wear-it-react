import { Member } from './member';

export interface Review {
	_id: string;
	productId: string;
	memberId: string;
	rating: number;
	comment?: string;
	createdAt: Date;
	updatedAt: Date;

	memberData?: Member;
}

export interface ReviewInput {
	productId: string;
	rating: number;
	comment?: string;
	memberId?: string;
}

export interface ReviewUpdateInput {
	_id: string;
	rating?: number;
	comment?: string;
}
