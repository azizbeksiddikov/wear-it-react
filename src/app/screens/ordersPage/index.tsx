import React from 'react';
import { Container, Stack, Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useState, SyntheticEvent } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PausedOrders from './PausedOrders';
import ProcessOrders from './ProcessOrders';
import FinishedOrders from './FinishedOrders';
import '../../../css/orders.css';

export default function OrdersPage() {
	const [value, setValue] = useState('1');
	const handleChange = (e: SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};
	console.log(value);
	return (
		<div className="order-page">
			<Container className="order-container">
				<Stack className="order-left">
					<TabContext value={value}>
						<Stack className="order-nav-frame">
							<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
								<Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="table-list">
									<Tab label="PAUSED ORDERS" value={'1'} />
									<Tab label="PROCESS ORDERS" value={'2'} />
									<Tab label="FINISHED ORDERS" value={'3'} />
								</Tabs>
							</Box>
						</Stack>

						<Stack className="order-main-content">
							<PausedOrders />
							<ProcessOrders />
							<FinishedOrders />
						</Stack>
					</TabContext>
				</Stack>

				<Stack className="order-right">
					<Stack className="member-box order-info-box">
						<div className="order-user-img">
							<img src="/icons/default-user.svg" className="order-user-avatar" />
							<div className="order-user-icon-box">
								<img src="/icons/user-badge.svg" className="order-user-prof-img" />
							</div>
						</div>
						<Box className="order-user-name">Justin</Box>
						<Box className="order-user-prof">USER</Box>
						<Box className="liner" />
						<Stack className="order-user-address">
							<LocationOnIcon />
							<Box className="spec-address-text">South Korea, Busan</Box>
						</Stack>
					</Stack>

					<Stack className="card-info order-info-box">
						<Box className="card-input">Card Number: 5243 4090 2002 7495</Box>
						<Stack className="card-half">
							<Box className="card-half-input">07 / 24</Box>
							<Box className="card-half-input">CVV: 010</Box>
						</Stack>
						<Box className="card-input">Justin Robertson</Box>
						<Stack className="cards-box">
							<img src="/icons/western-card.svg"></img>
							<img src="/icons/master-card.svg"></img>
							<img src="/icons/paypal-card.svg"></img>
							<img src="/icons/visa-card.svg"></img>
						</Stack>
					</Stack>
				</Stack>
			</Container>
		</div>
	);
}
// .order-page
// .order-right
// .order-info-box
// .order-user-icon-box
// .order-user-prof-img {

// Now:
// .order-page .order-right .order-user-icon-box .order-user-prof-img {
