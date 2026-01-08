import { Stack, Typography, List, ListItem } from '@mui/material';
import ReviewCard from './ReviewCard';

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

interface ReviewListProps {
	reviews: Review[];
	currentMemberId?: string;
}

export default function ReviewList({ reviews, currentMemberId }: ReviewListProps) {
	const otherReviews = reviews.filter((review) => review.memberId !== currentMemberId);

	if (otherReviews.length === 0) {
		return (
			<Stack className="no-reviews">
				<Typography variant="h6">Other Reviews</Typography>
				<Typography variant="body2" className="empty-reviews-message">
					No other reviews yet
				</Typography>
			</Stack>
		);
	}

	return (
		<Stack className="other-reviews" spacing={2}>
			<Typography variant="h6">Other Reviews ({otherReviews.length})</Typography>
			<List disablePadding>
				{otherReviews.map((review) => (
					<ListItem key={review._id} disableGutters disablePadding sx={{ display: 'block', mb: 2 }}>
						<ReviewCard
							rating={review.rating}
							comment={review.comment}
							createdAt={review.createdAt}
							memberData={review.memberData}
							showUserInfo={true}
						/>
					</ListItem>
				))}
			</List>
		</Stack>
	);
}
