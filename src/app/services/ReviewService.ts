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
			let url = `${this.path}/review/create/`;
			console.log('url', url);

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
			let url = `${this.path}/review/update/`;
			console.log('url', url);

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

	public async deleteReview(reviewId: string): Promise<Review> {
		try {
			let url = `${this.path}/review/delete`;
			console.log('url', url);
			console.log('reviewId', reviewId);

			const result = await axios.post(url, { reviewId: reviewId }, { withCredentials: true });

			return result.data;
		} catch (err) {
			console.log('Error, getProducts', err);
			throw err;
		}
	}
}

export default ReviewService;
