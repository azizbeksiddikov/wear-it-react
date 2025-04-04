import React, { useState } from 'react';
import { Box, Button, Container, Stack, Grid, Avatar, Typography, Paper, Chip } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import StarsIcon from '@mui/icons-material/Stars';
import { useHistory } from 'react-router-dom';
import { useGlobals } from '../../hooks/useGlobals';
import '../../../css/user.css';
import { Member, MemberUpdateInput } from '../../../libs/types/member';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { Messages, serverApi } from '../../../libs/config';
import { T } from '../../../libs/types/common';
import MemberService from '../../services/MemberService.ts';

export default function UserPage() {
	const history = useHistory();
	const { authMember, setAuthMember } = useGlobals();
	if (!authMember) history.push('/');
	const [memberImage, setMemberImage] = useState<string>(
		authMember?.memberImage ? `${authMember.memberImage}` : `/icons/default-user.svg`,
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

	const memberEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		memberUpdateInput.memberEmail = e.target.value;
		setMemberUpdateInput({ ...memberUpdateInput });
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
			formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 10)}`;
		}

		e.target.value = formattedValue;

		setMemberUpdateInput({
			...memberUpdateInput,
			memberPhone: formattedValue,
		});
	};

	const memberPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		memberUpdateInput.memberPassword = e.target.value;
		setMemberUpdateInput({ ...memberUpdateInput });
	};

	const memberFullNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		memberUpdateInput.memberFullName = e.target.value;
		setMemberUpdateInput({ ...memberUpdateInput });
	};

	const memberAddressHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		memberUpdateInput.memberAddress = e.target.value;
		setMemberUpdateInput({ ...memberUpdateInput });
	};

	const memberDescHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		memberUpdateInput.memberDesc = e.target.value;
		setMemberUpdateInput({ ...memberUpdateInput });
	};

	const memberPointsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		memberUpdateInput.memberPoints = parseInt(e.target.value);
		setMemberUpdateInput({ ...memberUpdateInput });
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
				<Stack display={'flex'} flexDirection={'column'}>
					<Typography variant="h4" component="h1">
						Profile Settings
					</Typography>

					{/* Member Details */}
					<Stack className={'menu-content'}>
						{/* Image */}
						<Stack className={'member-media-frame'}>
							<img src={memberImage} className={'mb-image'} alt="default" />
							<Stack className={'media-change-box'}>
								<span>Upload image</span>
								<p>JPG, JPEG, PNG formats only!</p>
								<Box className={'up-del-box'}>
									<Button component="label" onChange={handleImageViewer}>
										<CloudDownloadIcon />
										<input type="file" hidden />
									</Button>
								</Box>
							</Stack>
						</Stack>

						{/* Email and Full Name */}
						<Stack className={'input-frame'}>
							{/* Email */}

							<Stack className={'short-input'}>
								<input
									className={'spec-input mb-nick'}
									type="text"
									placeholder={authMember?.memberEmail ?? 'no email'}
									value={memberUpdateInput.memberEmail}
									name="memberEmail"
									onChange={memberEmailHandler}
								/>
							</Stack>

							{/* Full Name */}
							<Stack className={'short-input'}>
								<label className={'spec-label'}>Full Name</label>
								<input
									className={'spec-input mb-phone'}
									type="text"
									placeholder={authMember?.memberFullName ? authMember.memberFullName : 'no full name'}
									value={memberUpdateInput.memberFullName}
									name="memberFullName"
									onChange={memberFullNameHandler}
								/>
							</Stack>
						</Stack>

						{/* Address and Phone */}
						<Stack className={'input-frame'}>
							{/* Phone */}
							<Stack className={'short-input'}>
								<label className={'spec-label'}>Phone</label>
								<input
									className={'spec-input mb-phone'}
									type="text"
									placeholder={authMember?.memberPhone ? authMember.memberPhone : 'no phone'}
									value={memberUpdateInput.memberPhone}
									name="memberPhone"
									onChange={memberPhoneHandler}
								/>
							</Stack>

							{/* Address */}
							<Stack className={'short-input'}>
								<label className={'spec-label'}>Address</label>
								<input
									className={'spec-input  mb-address'}
									type="text"
									placeholder={authMember?.memberAddress ? authMember.memberAddress : 'no address'}
									value={memberUpdateInput.memberAddress}
									name="memberAddress"
									onChange={memberAddressHandler}
								/>
							</Stack>
						</Stack>

						{/* Description */}
						<Stack className={'long-input'}>
							<label className={'spec-label'}>Description</label>
							<textarea
								className={'spec-textarea mb-description'}
								placeholder={authMember?.memberDesc ? authMember.memberDesc : 'no description'}
								value={memberUpdateInput.memberDesc}
								name="memberDesc"
								onChange={memberDescHandler}
							/>
						</Stack>

						{/* Save */}
						<Box className={'save-box'}>
							<Button variant={'contained'} onClick={handleSubmit}>
								Save
							</Button>
						</Box>
					</Stack>
				</Stack>
			</Container>
		</div>
	);
}
