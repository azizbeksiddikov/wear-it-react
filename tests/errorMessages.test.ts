import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	ERROR_MESSAGES,
	GENERIC_ERROR,
	NETWORK_ERROR,
	friendlyErrorMessage,
	getErrorCode,
} from '../src/libs/errorMessages.ts';

const backendError = (data: unknown, status = 400) => ({ response: { status, data } });

test('maps every known backend code to a friendly sentence', () => {
	for (const [code, text] of Object.entries(ERROR_MESSAGES)) {
		assert.equal(friendlyErrorMessage(backendError({ errorCode: code, message: 'raw backend text' })), text);
	}
});

test('translates by code, not by the backend text', () => {
	const err = backendError({ errorCode: 'WRONG_PASSWORD', message: 'Wrong password entered, please try again' });
	assert.equal(friendlyErrorMessage(err), ERROR_MESSAGES.WRONG_PASSWORD);
	assert.equal(getErrorCode(err), 'WRONG_PASSWORD');
});

test('falls back to the backend message when the code is unknown or missing', () => {
	assert.equal(friendlyErrorMessage(backendError({ errorCode: 'NEW_CODE', message: 'Custom text' })), 'Custom text');
	assert.equal(friendlyErrorMessage(backendError({ message: 'Old backend text' })), 'Old backend text');
});

test('shows a generic line when there is nothing better', () => {
	assert.equal(friendlyErrorMessage(backendError({}, 500)), GENERIC_ERROR);
	assert.equal(friendlyErrorMessage(undefined), GENERIC_ERROR);
	assert.equal(friendlyErrorMessage(null), GENERIC_ERROR);
	assert.equal(friendlyErrorMessage(42), GENERIC_ERROR);
});

test('reports a lost connection clearly', () => {
	assert.equal(friendlyErrorMessage({ code: 'ERR_NETWORK', message: 'Network Error', request: {} }), NETWORK_ERROR);
	assert.equal(friendlyErrorMessage({ request: {} }), NETWORK_ERROR);
});

test('an unauthorised response without a code asks the shopper to log in', () => {
	assert.equal(friendlyErrorMessage(backendError({}, 401)), ERROR_MESSAGES.NOT_AUTHENTICATED);
});

test('keeps text we wrote ourselves', () => {
	assert.equal(friendlyErrorMessage('Please, fill in all the fields'), 'Please, fill in all the fields');
	assert.equal(friendlyErrorMessage(new Error('Passwords do not match')), 'Passwords do not match');
});

test('explains the top-up errors in plain words', () => {
	assert.match(friendlyErrorMessage(backendError({ errorCode: 'TOPUP_INVALID_AMOUNT' })), /1 to 1,000/);
	assert.match(friendlyErrorMessage(backendError({ errorCode: 'TOPUP_LIMIT_REACHED' })), /10,000/);
});
