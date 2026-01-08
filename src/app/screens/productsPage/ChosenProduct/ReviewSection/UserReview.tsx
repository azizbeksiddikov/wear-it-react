import { Box, Typography, Stack, TextField, Rating } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ReviewCard from './ReviewCard';
import { T } from '../../../../../libs/types/common';

interface UserReviewProps {
	rating: number;
	comment: string;
	isEditing: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onSave: () => void;
	onRatingChange: (e: T) => void;
	onCommentChange: (e: T) => void;
}

export default function UserReview({
	rating,
	comment,
	isEditing,
	onEdit,
	onDelete,
	onSave,
	onRatingChange,
	onCommentChange,
}: UserReviewProps) {
	return (
		<Box mb={3} className="user-review">
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h6">Your Review</Typography>
				<Box display="flex" gap={1}>
					{!isEditing ? (
						<>
							<Button variant="outlined" size="small" onClick={onEdit}>
								Edit
							</Button>
							<Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={onDelete}>
								Delete
							</Button>
						</>
					) : (
						<Button variant="contained" color="primary" size="small" onClick={onSave}>
							Save
						</Button>
					)}
				</Box>
			</Box>

			{!isEditing ? (
				<ReviewCard rating={rating} comment={comment} />
			) : (
				<Box>
					<Stack spacing={2}>
						<Rating value={rating} onChange={onRatingChange} />
						<TextField
							fullWidth
							multiline
							rows={3}
							variant="outlined"
							label="Your Review"
							value={comment}
							onChange={onCommentChange}
						/>
					</Stack>
				</Box>
			)}
		</Box>
	);
}
