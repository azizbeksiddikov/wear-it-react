import React from 'react';
import { NavLink } from 'react-router-dom';

export default function OtherNavbar() {
	return (
		<nav>
			<ul>
				<li>
					<NavLink to="/">Home</NavLink>
				</li>
				<li>
					<NavLink to="/help">Help</NavLink>
				</li>
				<li>
					<NavLink to="/products">Products</NavLink>
				</li>
				<li>
					<NavLink to="/orders">Orders</NavLink>
				</li>
				<li>
					<NavLink to="/member-page">My Page</NavLink>
				</li>
			</ul>
		</nav>
	);
}
