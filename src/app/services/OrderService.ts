import axios from 'axios';
import { serverApi } from '../../libs/config';
import { BasketData } from '../../libs/types/search';
import { Order, OrderInquiry, OrderUpdateInput } from '../../libs/types/order';

class OrderService {
	private readonly path: string;
	constructor() {
		this.path = serverApi;
	}

	public async createOrder(newOrderInput: BasketData, address: string): Promise<Order> {
		try {
			const url = `${this.path}/order/create`;
			const result = await axios.post(
				url,
				{ ...newOrderInput, orderShippingAddress: address },
				{
					withCredentials: true,
				},
			);

			return result.data;
		} catch (err) {
			console.log('Error, createOrder:', err);
			throw err;
		}
	}

	public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
		try {
			axios.defaults.withCredentials = true;

			const url = `${this.path}/order/all/`;
			let query = `?page=${input.page}`;
			if (input.orderStatus) {
				query += `&orderStatus=${input.orderStatus}`;
			}

			const result = await axios.get(url + query);
			return result.data;
		} catch (err) {
			console.log('Error, getMyOrders:', err);
			throw err;
		}
	}

	public async updateOrder(input: OrderUpdateInput): Promise<Order> {
		try {
			const url = `${serverApi}/order/update`;

			const result = await axios.post(url, input, { withCredentials: true });

			return result.data;
		} catch (err) {
			console.log('Error, getMyOrders:', err);
			throw err;
		}
	}
}

export default OrderService;
