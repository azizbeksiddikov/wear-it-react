/**
 * Friendly error text for the storefront.
 *
 * The backend answers failed requests with `{ errorCode, message }`. We translate by `errorCode`
 * so rewording the backend text never changes what shoppers see. No imports on purpose: this file
 * is unit tested with the plain Node test runner.
 */

export const GENERIC_ERROR = 'Something went wrong. Please try again.';
export const NETWORK_ERROR = 'No connection. Check your internet and try again.';

export const ERROR_MESSAGES: Record<string, string> = {
	NO_MEMBER_EMAIL: 'We could not find an account with that email.',
	USED_EMAIL_PHONE: 'That email or phone number is already registered. Try logging in instead.',
	BLOCKED_USER: 'This account has been blocked. Please contact support.',
	WRONG_PASSWORD: 'Wrong password. Please try again.',
	NOT_AUTHENTICATED: 'Please log in first.',
	NOT_ENOUGH_POINTS: 'You do not have enough points for this order.',
	NO_ADDRESS: 'Please add your address in your profile first.',
	INVALID_ORDER: 'This order could not be processed. Refresh the page and try again.',
	OUT_OF_STOCK: 'Sorry, one of the items just ran out of stock.',
	TOPUP_INVALID_AMOUNT: 'Enter a whole number of points from 1 to 1,000.',
	TOPUP_LIMIT_REACHED: 'Your balance is at the 10,000-point limit. Spend some points first.',
	RATING_OUT_OF_RANGE: 'Please choose a rating from 1 to 5.',
	EXISTING_USER: 'An account with these details already exists.',
	FILE_UPLOAD_FAILED: 'The photo could not be uploaded. Try a different image.',
	TOKEN_CREATION_FAILED: 'We could not sign you in. Please try again.',
	NO_DATA_FOUND: 'We could not find what you were looking for.',
	CREATE_FAILED: 'We could not save that. Please try again.',
	UPDATE_FAILED: 'We could not save your changes. Please try again.',
	DELETE_FAILED: 'We could not delete that. Please try again.',
	SOMETHING_WENT_WRONG: GENERIC_ERROR,
};

type ErrorLike = {
	message?: unknown;
	code?: unknown;
	request?: unknown;
	response?: { status?: unknown; data?: { errorCode?: unknown; message?: unknown } | string };
};

/** The backend error code in an axios error, if there is one. */
export function getErrorCode(err: unknown): string | undefined {
	const data = (err as ErrorLike | null)?.response?.data;
	if (data && typeof data === 'object' && typeof data.errorCode === 'string') return data.errorCode;
	return undefined;
}

/**
 * Turn anything thrown by a request (or by our own validation) into a sentence for the shopper.
 * Order: known backend code, our own text (string or Error), backend message, network, generic.
 */
export function friendlyErrorMessage(err: unknown): string {
	// Text we wrote ourselves, e.g. "Please, login first".
	if (typeof err === 'string' && err.trim()) return err;
	if (err === null || typeof err !== 'object') return GENERIC_ERROR;

	const e = err as ErrorLike;
	const code = getErrorCode(err);
	if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];

	const data = e.response?.data;
	const backendMessage = data && typeof data === 'object' ? data.message : undefined;
	if (typeof backendMessage === 'string' && backendMessage.trim()) return backendMessage;

	// The request left the browser but nothing came back (offline, DNS, CORS, server down).
	if (!e.response && (e.code === 'ERR_NETWORK' || e.request)) return NETWORK_ERROR;

	if (e.response?.status === 401) return ERROR_MESSAGES.NOT_AUTHENTICATED;

	// An Error we threw ourselves (no response, no request).
	if (!e.response && !e.request && e.code === undefined && typeof e.message === 'string' && e.message.trim()) {
		return e.message;
	}

	return GENERIC_ERROR;
}
