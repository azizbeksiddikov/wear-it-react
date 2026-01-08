import React, { useState } from 'react';
import { Box, Button, Container, Stack, Typography, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import { useGlobals } from '../../hooks/useGlobals';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { Messages } from '../../../libs/config';
import { T } from '../../../libs/types/common';
import MemberService from '../../services/MemberService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import '../../../css/user.css';
import { MemberUpdateInput } from '../../../libs/types/member';

export default function UserPage() {
	const navigate = useNavigate();
	const { authMember, setAuthMember } = useGlobals();
	if (!authMember) navigate('/');
	const [memberImage, setMemberImage] = useState<string>(
		authMember?.memberImage ? `${authMember.memberImage}` : `/icons/default-user.svg`,
	);
	const [isDefaultImage, setIsDefaultImage] = useState<boolean>(
		!authMember?.memberImage || authMember.memberImage.includes('default-user.svg'),
	);
	const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
		memberEmail: authMember?.memberEmail || '',
		memberPhone: authMember?.memberPhone || '',
		memberPassword: authMember?.memberPassword || '',
		memberFullName: authMember?.memberFullName || '',
		memberAddress: authMember?.memberAddress || '',
		memberDesc: authMember?.memberDesc || '',
		memberImage: authMember?.memberImage || '',
		memberPoints: authMember?.memberPoints || 0,
	});

	/** Handlers */
	const memberEmailHandler = (email: string) => {
		setMemberUpdateInput({ ...memberUpdateInput, memberEmail: email });
	};

	const memberPhoneHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '');

		// Format with dashes automatically
		let formattedValue = '';
		if (value.length <= 3) {
			formattedValue = value;
		} else if (value.length <= 7) {
			formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
		} else {
			formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
		}

		setMemberUpdateInput({
			...memberUpdateInput,
			memberPhone: formattedValue,
		});
	};

	// TODO: Reset password
	// const memberPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	memberUpdateInput.memberPassword = e.target.value;
	// 	setMemberUpdateInput({ ...memberUpdateInput });
	// };

	const memberFullNameHandler = (value: string) => {
		setMemberUpdateInput({ ...memberUpdateInput, memberFullName: value });
	};

	const memberAddressHandler = (value: string) => {
		setMemberUpdateInput({ ...memberUpdateInput, memberAddress: value });
	};

	const memberDescHandler = (value: string) => {
		setMemberUpdateInput({ ...memberUpdateInput, memberDesc: value });
	};

	const memberPointsHandler = (value: string) => {
		setMemberUpdateInput({ ...memberUpdateInput, memberPoints: Number(value) || 0 });
	};

	const handleImageViewer = (e: T) => {
		const file = e.target.files[0];

		const fileType = file.type,
			validateImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];

		if (!validateImageTypes.includes(fileType)) {
			sweetErrorHandling(Messages.error5).then();
		} else {
			if (file) {
				memberUpdateInput.memberImage = file;
				setMemberUpdateInput({ ...memberUpdateInput });
				setMemberImage(URL.createObjectURL(file));
				setIsDefaultImage(false);
			}
		}
	};

	const handleSubmit = async () => {
		try {
			if (!authMember) throw new Error(Messages.error2);
			if (
				memberUpdateInput.memberEmail === '' ||
				memberUpdateInput.memberPhone === '' ||
				memberUpdateInput.memberAddress === ''
			)
				throw new Error(Messages.error3);

			const member = new MemberService();
			const result = await member.update(memberUpdateInput);
			setAuthMember(result);

			await sweetTopSmallSuccessAlert('Modified Successfully', 700);
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	return (
		<div className={'user-page'}>
			<Container>
				{/* Header */}
				<Box className="header">
					<Typography variant="h4" component="h1" className="title">
						Profile Settings
					</Typography>
				</Box>

				<Paper elevation={0} className="user-card">
					<Stack className="user-container">
						{/* Profile Image Section */}
						<Stack className={'user-media-frame'}>
							<Stack className={`image-container ${isDefaultImage ? 'default-image' : ''}`}>
								<img src={memberImage} className="profile-image" alt="profile" />
								<Stack className="image-overlay">
									<Button
										variant="contained"
										component="label"
										onChange={handleImageViewer}
										className="upload-btn"
										startIcon={<CloudUploadIcon />}
									>
										{isDefaultImage ? 'Add Photo' : 'Change Photo'}
										<input type="file" hidden />
									</Button>
									<Typography variant="caption" className="image-caption">
										JPG, JPEG, PNG formats only
									</Typography>
								</Stack>
							</Stack>
						</Stack>

						{/* Form Fields */}
						<Stack className="form-fields">
							{/* Email + Full Name */}
							<Stack className="form-row">
								<Box className="input-group">
									<label className="label">
										<EmailIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} />
										Email
									</label>
									<input
										className="input"
										type="email"
										placeholder={authMember?.memberEmail ?? 'Enter your email'}
										value={memberUpdateInput.memberEmail}
										name="memberEmail"
										onChange={(e: T) => {
											memberEmailHandler(e.target.value);
										}}
									/>
								</Box>

								<Box className="input-group">
									<label className="label">
										<PersonIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} />
										Full Name
									</label>
									<input
										className="input"
										type="text"
										placeholder={authMember?.memberFullName ? authMember.memberFullName : 'Enter your full name'}
										value={memberUpdateInput.memberFullName}
										name="memberFullName"
										onChange={(e: T) => memberFullNameHandler(e.target.value)}
									/>
								</Box>
							</Stack>

							{/* Phone Number + Address */}
							<Stack className="form-row">
								<Box className="input-group">
									<label className="label">
										<PhoneIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} />
										Phone
									</label>
									<input
										className="input"
										type="text"
										placeholder={authMember?.memberPhone ? authMember.memberPhone : 'Enter your phone number'}
										value={memberUpdateInput.memberPhone}
										name="memberPhone"
										onChange={memberPhoneHandler}
									/>
								</Box>

								<Box className="input-group">
									<label className="label">
										<HomeIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} />
										Address
									</label>
									<input
										className="input"
										type="text"
										placeholder={authMember?.memberAddress ? authMember.memberAddress : 'Enter your address'}
										value={memberUpdateInput.memberAddress}
										name="memberAddress"
										onChange={(e: T) => {
											memberAddressHandler(e.target.value);
										}}
									/>
								</Box>
							</Stack>

							{/* Adding points */}
							<Stack className="form-row">
								<Box className="input-group">
									<label className="label">
										<EmojiEventsIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle', color: '#F9A825' }} />
										Reward Points
									</label>
									<input
										className="input"
										type="text"
										placeholder="Enter your points"
										value={memberUpdateInput.memberPoints}
										name="memberPoints"
										onChange={(e: T) => {
											memberPointsHandler(e.target.value);
										}}
									/>
								</Box>
							</Stack>

							{/* Description */}
							<Box className="input-group">
								<label className="label">
									<DescriptionIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} />
									About You
								</label>
								<textarea
									className="textarea"
									placeholder={authMember?.memberDesc ? authMember.memberDesc : 'Tell us about yourself'}
									value={memberUpdateInput.memberDesc}
									name="memberDesc"
									onChange={(e: T) => {
										memberDescHandler(e.target.value);
									}}
									rows={4}
								/>
							</Box>

							<Box className="form-actions">
								<Button variant="contained" className="save-btn" onClick={handleSubmit} startIcon={<SaveIcon />}>
									Save Changes
								</Button>
							</Box>
						</Stack>
					</Stack>
				</Paper>
			</Container>
		</div>
	);
}
