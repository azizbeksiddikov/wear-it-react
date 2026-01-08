import axios from 'axios';
import { serverApi } from '../../libs/config';
import { ReviewInput, Review, ReviewUpdateInput } from '../../libs/types/review';
import { T } from '../../libs/types/common';

class ReviewService {
	private readonly path: string;

	constructor() {
		this.path = serverApi;
	}

	public async createReview(input: ReviewInput): Promise<Review> {
		try {
			const url = `${this.path}/review/create/`;

			const data: T = {
				productId: input.productId,
				rating: input.rating,
			};
			if (input.comment) data.comment = input.comment;

			const result = await axios.post(url, data, { withCredentials: true });

			return result.data;
		} catch (err) {
			console.log('Error, getProducts', err);
			throw err;
		}
	}

	public async updateReview(input: ReviewUpdateInput): Promise<Review> {
		try {
			const url = `${this.path}/review/update/`;
			const data: T = {
				_id: input._id,
			};
			if (input.rating) data.rating = input.rating;
			if (input.comment) data.comment = input.comment;

			const result = await axios.post(url, data, { withCredentials: true });

			return result.data;
		} catch (err) {
			console.log('Error, getProducts', err);
			throw err;
		}
	}

	public async deleteReview(id: string): Promise<Review> {
		try {
			const url = `${this.path}/review/delete/${id}`;

			const result = await axios.post(url, { id: id }, { withCredentials: true });

			return result.data;
		} catch (err) {
			console.log('Error, getProducts', err);
			throw err;
		}
	}
}

export default ReviewService;
