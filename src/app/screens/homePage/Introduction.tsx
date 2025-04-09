import React from 'react';
import { Link } from 'react-router-dom';

import { Button, Typography } from '@mui/material';

import '../../../css/homePage/introduction.css';

export default function Introduction() {
	return (
		<div className="introduction-frame">
			<div className="introduction-frame-content">
				<Typography className="introduction-title">
					Discover Your <span className="text-primary">Style</span>
				</Typography>
				<Typography className="intro-text">Find inspiration and shop the latest trends curated just for you</Typography>
				<Link to="/products">
					<Button variant="contained" className="shop-button">
						Shop Now
					</Button>
				</Link>
			</div>
		</div>
	);
}
