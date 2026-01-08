import { Card, CardContent, Box, Typography, Rating } from '@mui/material';

interface ReviewCardProps {
	rating: number;
	comment?: string;
	createdAt?: Date;
	memberData?: {
		memberImage?: string;
		memberFullName?: string;
		memberEmail?: string;
	};
	showUserInfo?: boolean;
}

export default function ReviewCard({ rating, comment, createdAt, memberData, showUserInfo = false }: ReviewCardProps) {
	return (
		<Card className="review-card">
			<CardContent>
				<Box className="review-header" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
					<Rating value={rating} readOnly precision={0.5} />
					{createdAt && (
						<Typography variant="body2" color="textSecondary">
							{new Date(createdAt).toLocaleDateString()}
						</Typography>
					)}
				</Box>

				{/* User info with avatar */}
				{showUserInfo && memberData && (
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
						<Box
							component="img"
							src={memberData.memberImage || '/img/default-user.webp'}
							alt="User"
							sx={{
								width: 36,
								height: 36,
								borderRadius: '50%',
								mr: 1.5,
								objectFit: 'cover',
							}}
							onError={(e) => {
								e.currentTarget.src = '/icons/default-user.svg';
							}}
						/>
						<Typography variant="subtitle2" gutterBottom sx={{ m: 0 }}>
							{memberData.memberFullName || memberData.memberEmail || 'Anonymous'}
						</Typography>
					</Box>
				)}

				{comment && <Typography variant="body1">{comment}</Typography>}
			</CardContent>
		</Card>
	);
}
