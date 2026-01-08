import { useState } from 'react';
import { CartItem } from '../../libs/types/search';

interface UseBasketReturn {
	cartItems: CartItem[];
	onAdd: (input: CartItem) => void;
	onRemove: (input: CartItem) => void;
	onDelete: (input: CartItem) => void;
	onDeleteAll: () => void;
}

const useBasket = (): UseBasketReturn => {
	const cartJson: string | null = localStorage.getItem('cartData');
	const currentCart = cartJson ? JSON.parse(cartJson) : [];
	const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);

	const onAdd = (input: CartItem) => {
		const exist: any = cartItems.find((item: CartItem) => item.variantId === input.variantId);
		if (exist) {
			const cartUpdate = cartItems.map((item: CartItem) =>
				item.variantId === input.variantId ? { ...exist, itemQuantity: exist.itemQuantity + 1 } : item,
			);
			setCartItems(cartUpdate);
			localStorage.setItem('cartData', JSON.stringify(cartUpdate));
		} else {
			const cartUpdate = [...cartItems, { ...input }];
			setCartItems(cartUpdate);
			localStorage.setItem('cartData', JSON.stringify(cartUpdate));
		}
	};

	const onRemove = (input: CartItem) => {
		const exist: any = cartItems.find((item: CartItem) => item.variantId === input.variantId);
		if (!exist) return;
		if (exist.itemQuantity === 1) {
			const cartUpdate = cartItems.filter((item: CartItem) => item.variantId !== input.variantId);
			setCartItems(cartUpdate);
			localStorage.setItem('cartData', JSON.stringify(cartUpdate));
		} else {
			const cartUpdate = cartItems.map((item: CartItem) =>
				item.variantId === input.variantId ? { ...exist, itemQuantity: exist.itemQuantity - 1 } : item,
			);
			setCartItems(cartUpdate);
			localStorage.setItem('cartData', JSON.stringify(cartUpdate));
		}
	};

	const onDelete = (input: CartItem) => {
		const cartUpdate = cartItems.filter((item: CartItem) => item.variantId !== input.variantId);
		setCartItems(cartUpdate);
		localStorage.setItem('cartData', JSON.stringify(cartUpdate));
	};

	const onDeleteAll = () => {
		setCartItems([]);
		localStorage.removeItem('cartData');
	};

	return { cartItems, onAdd, onRemove, onDelete, onDeleteAll };
};

export default useBasket;
