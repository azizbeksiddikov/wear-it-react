import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from '@mui/joy/styles';
import CardOverflow from '@mui/joy/CardOverflow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AspectRatio from '@mui/joy/AspectRatio';
import Divider from '../../components/divider';

const list = [
	{ _id: 100, producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ _id: 101, producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ _id: 102, producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ _id: 103, producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
];

export default function FeaturedClothes() {
	return (
		<div className="new-products-frame">
			<Container>
				<Stack className="main">
					<Box className="category-title">Fresh Menu</Box>
					<Stack className="cards-frame">
						<CssVarsProvider>
							{list.length !== 0 ? (
								list.map((ele, index) => {
									return (
										<Card key={index} variant="outlined" className="card">
											<CardOverflow>
												<div className="product-sale">Normal size</div>
												<AspectRatio ratio="1">
													<img src={ele.productImages[0]} alt="" />
												</AspectRatio>
											</CardOverflow>

											<CardOverflow variant="soft" className="product-detail">
												<Stack className="info">
													<Stack flexDirection={'row'}>
														<Typography className="title">{ele.producName}</Typography>
														<Divider width="2" height="24" bg="#d9d9d9" />
														<Typography className="price">$20</Typography>
													</Stack>
													<Stack>
														<Typography className="views">
															20
															<VisibilityIcon sx={{ fontSize: 20, ml: '5px' }} />
														</Typography>
													</Stack>
												</Stack>
											</CardOverflow>
										</Card>
									);
								})
							) : (
								<Box className="no-data">New Products are not available!</Box>
							)}
						</CssVarsProvider>
					</Stack>
				</Stack>
			</Container>
		</div>
	);
}
