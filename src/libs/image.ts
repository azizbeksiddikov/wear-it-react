import { SyntheticEvent } from 'react';

/** Calm placeholder shown when a product photo is missing or fails to load. */
export const IMAGE_PLACEHOLDER = '/icons/noimage-list.svg';

/** `src` for a product photo: the first photo, or the placeholder when the product has none. */
export const photoOf = (images?: string[] | null) => (images && images[0]) || IMAGE_PLACEHOLDER;

/** Use as `onError` on an `<img>`: swap in the placeholder once, never loop. */
export const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
	const img = e.currentTarget;
	if (img.dataset.fallback === 'true') return;
	img.dataset.fallback = 'true';
	img.src = IMAGE_PLACEHOLDER;
};
