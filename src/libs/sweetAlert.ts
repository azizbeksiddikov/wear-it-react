/** SweetAlertHandling **/
import Swal from 'sweetalert2';
import { Messages } from './config';

export const sweetErrorHandling = async (err: any, duration: number = 1500) => {
	const error = err.response?.data ?? err;
	const message = error?.message ?? Messages.error1;
	await Swal.fire({
		icon: 'error',
		text: message,
		showConfirmButton: false,
		timer: duration,
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

export const sweetFailureProvider = (msg: string, show_button: boolean = false, forward_url: string = '') => {
	Swal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: show_button,
		confirmButtonText: 'OK',
	}).then(() => {
		if (forward_url !== '') {
			window.location.replace(forward_url);
		}
	});
};
