import { ProductInquiry, Products } from '../../libs/types/product';
import { serverApi } from '../../libs/config';
import axios from 'axios';

class ProductService {
	private readonly path: string;

	constructor() {
		this.path = serverApi;
	}

	public async getProducts(input: ProductInquiry): Promise<Products> {
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
}

export default ProductService;
