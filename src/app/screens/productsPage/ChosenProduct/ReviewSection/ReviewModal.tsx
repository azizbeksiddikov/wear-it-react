import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, Rating } from '@mui/material';
import Button from '@mui/material/Button';
import { T } from '../../../../../libs/types/common';

interface ReviewModalProps {
	open: boolean;
	rating: number;
	comment: string;
	onClose: () => void;
	onRatingChange: (e: T) => void;
	onCommentChange: (e: T) => void;
	onSubmit: () => void;
}

export default function ReviewModal({
	open,
	rating,
	comment,
	onClose,
	onRatingChange,
	onCommentChange,
	onSubmit,
}: ReviewModalProps) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="review-modal">
			<DialogTitle className="review-modal-title">Write a Review</DialogTitle>
			<DialogContent>
				<Box sx={{ my: 2 }}>
					<Typography component="legend">Your Rating</Typography>
					<Rating name="product-rating" value={rating} onChange={onRatingChange} size="large" sx={{ my: 1 }} />
					<TextField
						label="Your Review (optional)"
						multiline
						rows={4}
						value={comment || ''}
						onChange={onCommentChange}
						fullWidth
						variant="outlined"
						placeholder="Share your experience with this product..."
						sx={{ mt: 2 }}
						inputProps={{ maxLength: 500 }}
					/>
					{comment && (
						<Typography variant="caption" color="text.secondary" align="right" display="block" sx={{ mt: 0.5 }}>
							{comment.length}/500
						</Typography>
					)}
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3 }}>
				<Button onClick={onClose} variant="outlined">
					Cancel
				</Button>
				<Button onClick={onSubmit} variant="contained" color="primary" disabled={!rating}>
					Submit Review
				</Button>
			</DialogActions>
		</Dialog>
	);
}
