import axios from 'axios';
import { serverApi } from '../../libs/config';

class OrderService {
	private readonly path: string;
	constructor() {
		this.path = serverApi;
	}
}

export default OrderService;
