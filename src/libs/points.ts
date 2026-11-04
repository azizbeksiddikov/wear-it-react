/**
 * Small pure helpers for the shipping address and the points balance.
 *
 * Wearit is a demo store: points are free and no real money is involved. The backend lets a member
 * add `MIN_TOPUP` to `MAX_TOPUP` points at a time and keeps the balance at or below `MAX_BALANCE`.
 * No imports on purpose: this file is unit tested with the plain Node test runner.
 */

export const MIN_TOPUP = 1;
export const MAX_TOPUP = 1000;
export const MAX_BALANCE = 10000;
export const TOPUP_PRESETS = [100, 500, 1000];

const format = (n: number) => n.toLocaleString('en-US');

/** The member's saved shipping address, or null when there is none (empty or only spaces). */
export function shippingAddressOf(member: { memberAddress?: string | null } | null | undefined): string | null {
	const address = member?.memberAddress?.trim();
	return address ? address : null;
}

/** How many more points a member needs to pay `total` (0 when the balance is enough). */
export function pointsMissing(balance: number, total: number): number {
	const missing = Math.ceil(total - (Number.isFinite(balance) ? balance : 0));
	return missing > 0 ? missing : 0;
}

export type TopUpCheck = { ok: true; amount: number } | { ok: false; message: string };

/** Check what the shopper typed before it is sent. The backend checks again. */
export function checkTopUp(input: string | number, balance: number): TopUpCheck {
	const text = String(input).trim().replace(/,/g, '');
	if (text === '') return { ok: false, message: 'Enter how many points to add.' };
	if (!/^\d+$/.test(text)) return { ok: false, message: 'Enter a whole number, like 250.' };

	const amount = Number(text);
	if (amount < MIN_TOPUP || amount > MAX_TOPUP) {
		return { ok: false, message: `You can add ${MIN_TOPUP} to ${format(MAX_TOPUP)} points at a time.` };
	}

	const room = MAX_BALANCE - (Number.isFinite(balance) ? balance : 0);
	if (room <= 0) {
		return { ok: false, message: `Your balance is already at the ${format(MAX_BALANCE)}-point limit.` };
	}
	if (amount > room) {
		return {
			ok: false,
			message: `Your balance can hold ${format(MAX_BALANCE)} points at most. You can add up to ${format(room)} more.`,
		};
	}
	return { ok: true, amount };
}
