import { useState } from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ReviewModal from './ReviewModal';
import UserReview from './UserReview';
import ReviewList from './ReviewList';
import ReviewService from '../../../../services/ReviewService';
import { ReviewInput, ReviewUpdateInput } from '../../../../../libs/types/review';
import { T } from '../../../../../libs/types/common';
import { sweetConfirm, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../../../libs/sweetAlert';

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
			.then(() => sweetTopSmallSuccessAlert('Thanks for your review', 1500))
			.catch((err) => {
				console.error('Error creating review:', err);
				sweetErrorHandling(err).then();
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
				sweetErrorHandling(err).then();
			});
	};

	const handleDeleteReview = async () => {
		if (!memberReview) return;
		if (!(await sweetConfirm('Delete your review?', 'Delete'))) return;
		reviewService
			.deleteReview(memberReview._id)
			.then(() => {
				onRefetch();
			})
			.catch((err) => {
				console.error('Error deleting review:', err);
				sweetErrorHandling(err).then();
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
						variant="contained"
						color="primary"
						onClick={() => setReviewModalOpen(true)}
						disabled={!authMember || isReviewValid === false}
						aria-describedby={!authMember ? 'review-hint' : undefined}
					>
						Write Review
					</Button>
					{!authMember && (
						<p id="review-hint" className="add-hint" style={{ textAlign: 'left' }}>
							Log in to write a review.
						</p>
					)}
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
