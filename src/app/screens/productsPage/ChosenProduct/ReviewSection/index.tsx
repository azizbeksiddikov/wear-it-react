import { useState } from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ReviewModal from './ReviewModal';
import UserReview from './UserReview';
import ReviewList from './ReviewList';
import ReviewService from '../../../../services/ReviewService';
import { ReviewInput, ReviewUpdateInput } from '../../../../../libs/types/review';
import { T } from '../../../../../libs/types/common';

interface Review {
	_id: string;
	rating: number;
	comment?: string;
	createdAt?: Date;
	memberId: string;
	memberData?: {
		memberImage?: string;
		memberFullName?: string;
		memberEmail?: string;
	};
}

interface MemberReview {
	_id: string;
	rating: number;
	comment?: string;
	memberId: string;
}

interface ReviewSectionProps {
	productId: string;
	memberReview?: MemberReview;
	productReviews?: Review[];
	isReviewValid?: boolean;
	authMember: any;
	onRefetch: () => void;
}

export default function ReviewSection({
	productId,
	memberReview,
	productReviews,
	isReviewValid,
	authMember,
	onRefetch,
}: ReviewSectionProps) {
	const [reviewModalOpen, setReviewModalOpen] = useState(false);
	const [isEditingReview, setIsEditingReview] = useState(false);
	const [reviewUpdate, setReviewUpdate] = useState({
		rating: memberReview?.rating ?? 0,
		comment: memberReview?.comment ?? '',
	});

	const reviewService = new ReviewService();

	const handleRatingChange = (e: T) => {
		setReviewUpdate({
			...reviewUpdate,
			rating: Number(e.target.value) ? Number(e.target.value) : 0,
		});
	};

	const handleCommentChange = (e: T) => {
		setReviewUpdate({
			...reviewUpdate,
			comment: e.target.value,
		});
	};

	const handleCreateReview = () => {
		const reviewData: ReviewInput = {
			productId: productId,
			rating: reviewUpdate.rating as number,
			comment: (reviewUpdate.comment || '').trim() || undefined,
		};

		reviewService
			.createReview(reviewData)
			.then(() => {
				setReviewModalOpen(false);
				onRefetch();
			})
			.catch((err) => {
				console.error('Error creating review:', err);
			});
	};

	const handleUpdateReview = () => {
		if (!memberReview) return;

		const reviewData: ReviewUpdateInput = {
			_id: memberReview._id,
			rating: reviewUpdate.rating as number,
			comment: (reviewUpdate.comment || '').trim() || undefined,
		};

		reviewService
			.updateReview(reviewData)
			.then(() => {
				setIsEditingReview(false);
				onRefetch();
			})
			.catch((err) => {
				console.error('Error updating review:', err);
			});
	};

	const handleDeleteReview = () => {
		if (!memberReview) return;
		reviewService
			.deleteReview(memberReview._id)
			.then(() => {
				onRefetch();
			})
			.catch((err) => {
				console.error('Error deleting review:', err);
			});
	};

	const handleEditReview = () => {
		setIsEditingReview(true);
	};

	return (
		<>
			{/* Write Review Button */}
			{!memberReview && (
				<Box mb={3}>
					<Button
						style={{
							backgroundColor: !authMember || isReviewValid === false ? '#9e9e9e' : '#2196f3',
							color: 'white',
						}}
						variant="contained"
						onClick={() => setReviewModalOpen(true)}
						disabled={!authMember || isReviewValid === false}
					>
						Write Review
					</Button>
				</Box>
			)}

			{/* My Review */}
			{memberReview && (
				<UserReview
					rating={reviewUpdate.rating}
					comment={reviewUpdate.comment}
					isEditing={isEditingReview}
					onEdit={handleEditReview}
					onDelete={handleDeleteReview}
					onSave={handleUpdateReview}
					onRatingChange={handleRatingChange}
					onCommentChange={handleCommentChange}
				/>
			)}

			{/* Other Reviews */}
			<ReviewList reviews={productReviews || []} currentMemberId={memberReview?.memberId} />

			{/* Create Review Modal */}
			<ReviewModal
				open={reviewModalOpen}
				rating={reviewUpdate.rating}
				comment={reviewUpdate.comment}
				onClose={() => setReviewModalOpen(false)}
				onRatingChange={handleRatingChange}
				onCommentChange={handleCommentChange}
				onSubmit={handleCreateReview}
			/>
		</>
	);
}
