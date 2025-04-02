import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Stack, Grid, Avatar, Typography, Paper, Chip } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import StarsIcon from '@mui/icons-material/Stars';
import '../../../css/user.css';

export interface Member {
	memberEmail: string;
	memberPhone: string;
	memberPassword?: string;
	memberFullName?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberImage?: string;
	memberPoints: number;
}

export default function UserPage() {
	const mockMember: Member = {
		memberEmail: 'martin@example.com',
		memberPhone: '821024694424',
		memberFullName: 'Martin Something',
		memberAddress: 'Some Address',
		memberDesc: 'Some Description',
		memberImage: '/icons/default-user.svg',
		memberPoints: 100,
	};

	const [username, setUsername] = useState(mockMember.memberFullName || '');
	const [email, setEmail] = useState(mockMember.memberEmail);
	const [phone, setPhone] = useState(mockMember.memberPhone);
	const [phoneError, setPhoneError] = useState('');
	const [address, setAddress] = useState(mockMember.memberAddress || '');
	const [description, setDescription] = useState(mockMember.memberDesc || '');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(mockMember.memberImage || null);

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Only allow digits, remove all other characters
		const value = e.target.value.replace(/\D/g, '');

		// Format with dashes automatically
		let formattedValue = '';
		if (value.length <= 3) {
			formattedValue = value;
		} else if (value.length <= 7) {
			formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
		} else {
			formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 10)}`;
		}

		setPhone(formattedValue);
		validatePhone(formattedValue);
	};

	const validatePhone = (phoneNumber: string) => {
		const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
		if (!phoneRegex.test(phoneNumber) && phoneNumber.length > 0 && phoneNumber.length >= 12) {
			setPhoneError('Phone number must be in format: 010-1111-1111');
		} else {
			setPhoneError('');
		}
	};

	// Add the missing handleImageChange function
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setSelectedImage(null);
			setPreviewImage(null);
		}
	};

	useEffect(() => {
		// Format initial phone number if needed
		if (phone) {
			const digitsOnly = phone.replace(/\D/g, '');
			let formatted = '';

			if (digitsOnly.length <= 3) {
				formatted = digitsOnly;
			} else if (digitsOnly.length <= 7) {
				formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
			} else {
				formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 10)}`;
			}

			setPhone(formatted);
		}
	}, []);

	return (
		<div className={'user-page'}>
			<Container>
				<Paper elevation={3} className="profile-paper">
					<Stack className={'my-page-frame'}>
						<Box display={'flex'} flexDirection={'column'}>
							<Box className={'menu-name'}>
								<Typography variant="h4" component="h1">
									Profile Settings
								</Typography>
							</Box>
							<Box className={'menu-content'}>
								<Box className={'settings'}>
									<Grid container spacing={4}>
										<Grid item xs={12} md={4}>
											<Box className="points-display" mb={3}>
												<Typography variant="h6" gutterBottom fontWeight="bold">
													Points Balance
												</Typography>
												<Chip
													icon={<StarsIcon />}
													label={`${mockMember.memberPoints}`}
													color="primary"
													className="points-chip"
												/>
											</Box>

											<Box className={'member-media-frame'}>
												{previewImage ? (
													<Avatar
														alt="User Avatar"
														src={previewImage}
														className={'mb-image'}
														sx={{ width: 120, height: 120 }}
													/>
												) : (
													<Avatar
														alt="User Avatar"
														src={'/icons/default-user.svg'}
														className={'mb-image'}
														sx={{ width: 120, height: 120 }}
													/>
												)}
												<div className={'media-change-box'}>
													<Typography variant="subtitle1" fontWeight="bold">
														Upload image
													</Typography>
													<Typography variant="body2" color="text.secondary">
														JPG, JPEG, PNG formats only!
													</Typography>
													<div className={'upload-actions'}>
														<Button
															variant="outlined"
															component="label"
															startIcon={<CloudDownloadIcon />}
															className="upload-btn"
														>
															Choose File
															<input type="file" hidden onChange={handleImageChange} />
														</Button>
													</div>
												</div>
											</Box>
										</Grid>

										<Grid item xs={12} md={8}>
											<Grid container spacing={3}>
												<Grid item xs={12}>
													<Box className={'input-frame'}>
														<label className={'spec-label'}>
															<EmailIcon className="input-icon" /> Email
														</label>
														<input
															className={'spec-input'}
															type="email"
															value={email}
															name="memberEmail"
															onChange={(e) => setEmail(e.target.value)}
															placeholder="Enter your email address"
														/>
													</Box>
												</Grid>

												<Grid item xs={12}>
													<Box className={'input-frame'}>
														<label className={'spec-label'}>Full Name</label>
														<input
															className={'spec-input mb-nick'}
															type="text"
															placeholder={'Enter your full name'}
															value={username}
															name="memberFullName"
															onChange={(e) => setUsername(e.target.value)}
														/>
													</Box>
												</Grid>

												<Grid item xs={12} md={6}>
													<Box className={'input-frame'}>
														<label className={'spec-label'}>
															<PhoneIcon className="input-icon" /> Phone
														</label>
														<input
															className={`spec-input mb-phone ${phoneError ? 'error-input' : ''}`}
															type="text"
															placeholder={'010-1111-111'}
															value={phone}
															name="memberPhone"
															onChange={handlePhoneChange}
															maxLength={12} // 3 digits + 4 digits + 3 digits + 2 dashes
														/>
														{phoneError && (
															<Typography variant="caption" color="error" className="error-text">
																{phoneError}
															</Typography>
														)}
													</Box>
												</Grid>

												<Grid item xs={12} md={6}>
													<Box className={'input-frame'}>
														<label className={'spec-label'}>
															<HomeIcon className="input-icon" /> Address
														</label>
														<input
															className={'spec-input mb-address'}
															type="text"
															placeholder={'Enter your address'}
															value={address}
															name="memberAddress"
															onChange={(e) => setAddress(e.target.value)}
														/>
													</Box>
												</Grid>

												<Grid item xs={12}>
													<Box className={'input-frame'}>
														<label className={'spec-label'}>
															<DescriptionIcon className="input-icon" /> About Me
														</label>
														<textarea
															className={'spec-textarea mb-description'}
															placeholder={'Tell us about yourself'}
															value={description}
															name="memberDesc"
															onChange={(e) => setDescription(e.target.value)}
														/>
													</Box>
												</Grid>
											</Grid>
										</Grid>
									</Grid>

									<Box className={'save-box'}>
										<Button variant={'contained'} className="save-button" size="large">
											Save Changes
										</Button>
									</Box>
								</Box>
							</Box>
						</Box>
					</Stack>
				</Paper>
			</Container>
		</div>
	);
}
