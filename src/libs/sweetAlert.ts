/** SweetAlertHandling **/
import Swal from 'sweetalert2';
import { friendlyErrorMessage } from './errorMessages';

/** Show a friendly error. Long enough to read (3 s), and a tap or Escape closes it early. */
export const sweetErrorHandling = async (err: unknown, duration: number = 3000) => {
	await Swal.fire({
		icon: 'error',
		text: friendlyErrorMessage(err),
		showConfirmButton: false,
		timer: duration,
		allowEscapeKey: true,
		allowOutsideClick: true,
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 1500) => {
	await Swal.fire({
		position: 'center',
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetTopSmallSuccessAlert = async (msg: string, duration: number = 1500) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
	});

	Toast.fire({
		icon: 'success',
		title: msg,
	}).then();
};

/** A friendly question with one main action (not destructive). Resolves true when the shopper picks it. */
const sweetAsk = async (title: string, text: string, confirmText: string, cancelText: string): Promise<boolean> => {
	const result = await Swal.fire({
		icon: 'info',
		title,
		text,
		showCancelButton: true,
		confirmButtonText: confirmText,
		cancelButtonText: cancelText,
		reverseButtons: true,
		confirmButtonColor: '#e60023',
	});
	return result.isConfirmed;
};

/** Checkout needs a delivery address. True when the shopper wants to go and add one. */
export const sweetAskForAddress = () =>
	sweetAsk(
		'Add your address first',
		'We need a delivery address before you can check out. Your basket stays as it is.',
		'Go to my profile',
		'Not now',
	);

/** The balance is too low for this order. True when the shopper wants to add points. */
export const sweetAskForPoints = (missing: number) =>
	sweetAsk(
		'Not enough points',
		missing > 0
			? `You need ${missing.toLocaleString('en-US')} more ${missing === 1 ? 'point' : 'points'} to pay for this order. Points are free in this demo store.`
			: 'You need more points to pay for this order. Points are free in this demo store.',
		'Add points',
		'Not now',
	);

/** Ask before a destructive action. Cancel is the safe default and comes first. */
export const sweetConfirm = async (title: string, confirmText: string): Promise<boolean> => {
	const result = await Swal.fire({
		icon: 'warning',
		title,
		showCancelButton: true,
		confirmButtonText: confirmText,
		cancelButtonText: 'Cancel',
		reverseButtons: true,
		focusCancel: true,
		confirmButtonColor: '#c62828',
	});
	return result.isConfirmed;
};
