import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../css/user.css';
import { Messages } from '../../../libs/config';
import { handleImageError } from '../../../libs/image';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { MemberUpdateInput } from '../../../libs/types/member';
import { useGlobals } from '../../hooks/useGlobals';
import MemberService from '../../services/MemberService';
import BalanceCard from './BalanceCard';

const DEFAULT_PROFILE_IMAGE = '/img/default-user.webp';

type FieldErrors = Partial<Record<'memberEmail' | 'memberPhone' | 'memberAddress', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateProfile(input: MemberUpdateInput): FieldErrors {
	const errors: FieldErrors = {};
	if (!input.memberEmail) errors.memberEmail = 'Enter your email address.';
	else if (!EMAIL_PATTERN.test(input.memberEmail)) errors.memberEmail = 'Enter a valid email, like name@example.com.';
	if (!input.memberPhone) errors.memberPhone = 'Enter your phone number.';
	else if (!/^\d{3}-\d{4}-\d{4}$/.test(input.memberPhone)) errors.memberPhone = 'Use the format 010-1111-1111.';
	if (!input.memberAddress) errors.memberAddress = 'Enter your address.';
	return errors;
}

export default function UserPage() {
	const navigate = useNavigate();
	const { hash } = useLocation();
	const { authMember, setAuthMember } = useGlobals();
	// Signed-out visitors have nothing to edit here: send them home.
	useEffect(() => {
		if (!authMember) navigate('/');
	}, [authMember, navigate]);
	// "Add points" links here with #balance: bring the balance card into view.
	const signedIn = !!authMember;
	useEffect(() => {
		if (hash !== '#balance' || !signedIn) return;
		const card = document.getElementById('balance');
		card?.scrollIntoView({ block: 'start' });
		card?.focus({ preventScroll: true });
	}, [hash, signedIn]);
	const [memberImage, setMemberImage] = useState<string>(
		authMember?.memberImage ? `${authMember.memberImage}` : DEFAULT_PROFILE_IMAGE,
	);
	const [isDefaultImage, setIsDefaultImage] = useState<boolean>(
		!authMember?.memberImage || authMember.memberImage.includes('default-user'),
	);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [saving, setSaving] = useState(false);
	const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
		memberEmail: authMember?.memberEmail || '',
		memberPhone: authMember?.memberPhone || '',
		memberPassword: authMember?.memberPassword || '',
		memberFullName: authMember?.memberFullName || '',
		memberAddress: authMember?.memberAddress || '',
		memberDesc: authMember?.memberDesc || '',
		memberImage: authMember?.memberImage || '',
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

	const handleImageViewer = (e: T) => {
		const file = e.target.files?.[0];
		if (!file) return; // the picker was closed without a choice

		const validateImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
		if (!validateImageTypes.includes(file.type)) {
			sweetErrorHandling(Messages.error5).then();
			return;
		}
		setMemberUpdateInput({ ...memberUpdateInput, memberImage: file });
		setMemberImage(URL.createObjectURL(file));
		setIsDefaultImage(false);
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (saving) return;
		try {
			if (!authMember) throw new Error(Messages.error2);

			const found = validateProfile(memberUpdateInput);
			setErrors(found);
			const firstInvalid = (['memberEmail', 'memberPhone', 'memberAddress'] as const).find((k) => found[k]);
			if (firstInvalid) {
				document.getElementById(`profile-${firstInvalid}`)?.focus(); // focus the first error
				return;
			}

			setSaving(true);
			const member = new MemberService();
			const result = await member.update(memberUpdateInput);
			setAuthMember(result);

			await sweetTopSmallSuccessAlert('Modified Successfully', 700);
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		} finally {
			setSaving(false);
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

				<BalanceCard />

				<Paper elevation={0} className="user-card">
					<Stack className="user-container">
						{/* Profile Image Section */}
						<Stack className={'user-media-frame'}>
							<Stack className={`image-container ${isDefaultImage ? 'default-image' : ''}`}>
								<img src={memberImage} className="profile-image" alt="Your profile photo" onError={handleImageError} />
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
						<Stack className="form-fields" component="form" noValidate onSubmit={handleSubmit}>
							{/* Email + Full Name */}
							<Stack className="form-row">
								<Box className="input-group">
									<label className="label" htmlFor="profile-memberEmail">
										<EmailIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} aria-hidden="true" />
										Email
									</label>
									<input
										id="profile-memberEmail"
										className="input"
										type="email"
										inputMode="email"
										autoComplete="email"
										placeholder="name@example.com"
										value={memberUpdateInput.memberEmail}
										name="memberEmail"
										aria-invalid={!!errors.memberEmail}
										aria-describedby={errors.memberEmail ? 'profile-memberEmail-error' : undefined}
										onChange={(e: T) => {
											memberEmailHandler(e.target.value);
											if (errors.memberEmail) setErrors({ ...errors, memberEmail: undefined });
										}}
									/>
									{errors.memberEmail && (
										<span id="profile-memberEmail-error" className="field-error" role="alert">
											{errors.memberEmail}
										</span>
									)}
								</Box>

								<Box className="input-group">
									<label className="label" htmlFor="profile-memberFullName">
										<PersonIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} aria-hidden="true" />
										Full Name
									</label>
									<input
										id="profile-memberFullName"
										className="input"
										type="text"
										autoComplete="name"
										placeholder="Enter your full name"
										value={memberUpdateInput.memberFullName}
										name="memberFullName"
										onChange={(e: T) => memberFullNameHandler(e.target.value)}
									/>
								</Box>
							</Stack>

							{/* Phone Number + Address */}
							<Stack className="form-row">
								<Box className="input-group">
									<label className="label" htmlFor="profile-memberPhone">
										<PhoneIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} aria-hidden="true" />
										Phone
									</label>
									<input
										id="profile-memberPhone"
										className="input"
										type="tel"
										inputMode="tel"
										autoComplete="tel"
										placeholder="010-1111-1111"
										value={memberUpdateInput.memberPhone}
										name="memberPhone"
										aria-invalid={!!errors.memberPhone}
										aria-describedby={errors.memberPhone ? 'profile-memberPhone-error' : undefined}
										onChange={(e) => {
											memberPhoneHandler(e);
											if (errors.memberPhone) setErrors({ ...errors, memberPhone: undefined });
										}}
									/>
									{errors.memberPhone && (
										<span id="profile-memberPhone-error" className="field-error" role="alert">
											{errors.memberPhone}
										</span>
									)}
								</Box>

								<Box className="input-group">
									<label className="label" htmlFor="profile-memberAddress">
										<HomeIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} aria-hidden="true" />
										Address
									</label>
									<input
										id="profile-memberAddress"
										className="input"
										type="text"
										autoComplete="street-address"
										placeholder="Enter your address"
										value={memberUpdateInput.memberAddress}
										name="memberAddress"
										aria-invalid={!!errors.memberAddress}
										aria-describedby={errors.memberAddress ? 'profile-memberAddress-error' : undefined}
										onChange={(e: T) => {
											memberAddressHandler(e.target.value);
											if (errors.memberAddress) setErrors({ ...errors, memberAddress: undefined });
										}}
									/>
									{errors.memberAddress && (
										<span id="profile-memberAddress-error" className="field-error" role="alert">
											{errors.memberAddress}
										</span>
									)}
								</Box>
							</Stack>

							{/* Description */}
							<Box className="input-group">
								<label className="label" htmlFor="profile-memberDesc">
									<DescriptionIcon sx={{ fontSize: 18, marginRight: 1, verticalAlign: 'middle' }} aria-hidden="true" />
									About You
								</label>
								<textarea
									id="profile-memberDesc"
									className="textarea"
									placeholder="Tell us about yourself"
									value={memberUpdateInput.memberDesc}
									name="memberDesc"
									onChange={(e: T) => {
										memberDescHandler(e.target.value);
									}}
									rows={4}
								/>
							</Box>

							<Box className="form-actions">
								<Button
									type="submit"
									variant="contained"
									className="save-btn"
									disabled={saving}
									startIcon={<SaveIcon />}
								>
									{saving ? 'Saving…' : 'Save Changes'}
								</Button>
							</Box>
						</Stack>
					</Stack>
				</Paper>
			</Container>
		</div>
	);
}
