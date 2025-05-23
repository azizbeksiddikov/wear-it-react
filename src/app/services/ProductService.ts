import axios from 'axios';
import { serverApi } from '../../libs/config';
import { Product, ProductsInquiry, ProductsOutput } from '../../libs/types/product';

class ProductService {
	private readonly path: string;

	constructor() {
		this.path = serverApi;
	}

	public async getProducts(input: ProductsInquiry): Promise<ProductsOutput> {
		try {
			let url = `${this.path}/product/all?direction=${input.direction}&page=${input.page}&limit=${input.limit}`;
			if (input.productCategory) url += `&productCategory=${input.productCategory}`;
			if (input.productGender) url += `&productGender=${input.productGender}`;
			if (input.isFeatured) url += `&isFeatured=${input.isFeatured}`;
			if (input.onSale) url += `&onSale=${input.onSale}`;
			if (input.search) url += `&search=${input.search}`;

			const result = await axios.get(url);
			return result.data;
		} catch (err) {
			console.log('Error, getProducts', err);
			throw err;
		}
	}

	public async getProductById(id: string): Promise<Product> {
		try {
			const url = `${this.path}/product/${id}`;

			const result = await axios.get(url, { withCredentials: true });

			return result.data;
		} catch (err) {
			console.log('Error, getProductById', err);
			throw err;
		}
	}
}

export default ProductService;
