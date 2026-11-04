import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_BALANCE, checkTopUp, pointsMissing, shippingAddressOf } from '../src/libs/points.ts';

test('uses the saved address, trimmed', () => {
	assert.equal(shippingAddressOf({ memberAddress: '  1 Example Street ' }), '1 Example Street');
});

test('has no address when it is missing, empty or only spaces', () => {
	assert.equal(shippingAddressOf(null), null);
	assert.equal(shippingAddressOf(undefined), null);
	assert.equal(shippingAddressOf({}), null);
	assert.equal(shippingAddressOf({ memberAddress: '' }), null);
	assert.equal(shippingAddressOf({ memberAddress: '   ' }), null);
});

test('counts the points still missing', () => {
	assert.equal(pointsMissing(100, 110), 10);
	assert.equal(pointsMissing(100, 100.2), 1);
	assert.equal(pointsMissing(100, 60), 0);
	assert.equal(pointsMissing(0, 55), 55);
	assert.equal(pointsMissing(Number.NaN, 55), 55);
});

test('accepts a whole number from 1 to 1,000', () => {
	assert.deepEqual(checkTopUp('1', 0), { ok: true, amount: 1 });
	assert.deepEqual(checkTopUp(' 250 ', 100), { ok: true, amount: 250 });
	assert.deepEqual(checkTopUp('1,000', 100), { ok: true, amount: 1000 });
	assert.deepEqual(checkTopUp(500, 100), { ok: true, amount: 500 });
});

test('rejects empty, non-numeric and fractional input', () => {
	for (const bad of ['', '   ', 'abc', '12.5', '-5', '1e3', '0x10']) {
		const result = checkTopUp(bad, 100);
		assert.equal(result.ok, false, `"${bad}" should be rejected`);
	}
});

test('rejects amounts outside 1 to 1,000', () => {
	const zero = checkTopUp('0', 100);
	const big = checkTopUp('1001', 100);
	assert.equal(zero.ok, false);
	assert.equal(big.ok, false);
	if (!big.ok) assert.match(big.message, /1 to 1,000/);
});

test('respects the balance cap', () => {
	assert.deepEqual(checkTopUp('1000', MAX_BALANCE - 1000), { ok: true, amount: 1000 });
	const over = checkTopUp('500', MAX_BALANCE - 200);
	assert.equal(over.ok, false);
	if (!over.ok) assert.match(over.message, /up to 200 more/);
	const full = checkTopUp('1', MAX_BALANCE);
	assert.equal(full.ok, false);
	if (!full.ok) assert.match(full.message, /already at the 10,000-point limit/);
});
