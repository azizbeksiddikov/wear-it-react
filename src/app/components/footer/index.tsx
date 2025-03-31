import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Footers = styled.div`
	width: 100%;
	height: 590px;
	display: flex;
	background: #343434;
	background-size: cover;
`;

export default function Footer() {
	const authMember = true;

	return (
		<Footers>
			<Container>
				<Stack flexDirection={'row'} sx={{ mt: '94px' }}>
					<Stack flexDirection={'column'} style={{ width: '340px' }}>
						<Box className={'foot-desc-txt'}>Clothing Brand #1</Box>
						<Box className="sns-context">
							<img src={'/icons/facebook.svg'} alt="facebook" />
							<img src={'/icons/twitter.svg'} alt="twitter" />
							<img src={'/icons/instagram.svg'} alt="instagram" />
							<img src={'/icons/youtube.svg'} alt="youtube" />
						</Box>
					</Stack>
					<Stack sx={{ ml: '288px' }} flexDirection={'row'}>
						<Stack>
							<Box>
								<Box className={'foot-category-title'}>Bo'limlar</Box>
								<Box className={'foot-category-link'}>
									<Link to="/">Home</Link>
									<Link to="/products">Products</Link>
									{authMember && <Link to="/orders">Orders</Link>}
									<Link to="/help">Help</Link>
								</Box>
							</Box>
						</Stack>
						<Stack sx={{ ml: '100px' }}>
							<Box>
								<Box className={'foot-category-title'}>Find us</Box>
								<Box
									flexDirection={'column'}
									sx={{ mt: '20px' }}
									className={'foot-category-link'}
									justifyContent={'space-between'}
								>
									<Box flexDirection={'row'} className={'find-us'}>
										<span>L.</span>
										<div>Seoul, South Korea</div>
									</Box>
									<Box className={'find-us'}>
										<span>P.</span>
										<div>+82 10 7305 6799</div>
									</Box>
									<Box className={'find-us'}>
										<span>E.</span>
										<div>azbeksid@gmail.com</div>
									</Box>
									<Box className={'find-us'}>
										<span>H.</span>
										<div>Visit 24 hours</div>
									</Box>
								</Box>
							</Box>
						</Stack>
					</Stack>
				</Stack>
				<Stack style={{ border: '1px solid #C5C8C9', width: '100%', opacity: '0.2' }} sx={{ mt: '80px' }}></Stack>
				<Stack className={'copyright-txt'}>© Copyright, All rights reserved.</Stack>
			</Container>
		</Footers>
	);
}
