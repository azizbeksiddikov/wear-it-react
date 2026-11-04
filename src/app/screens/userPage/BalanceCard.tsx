import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Button, Paper, Stack } from '@mui/material';
import React, { useState } from 'react';
import { MAX_TOPUP, TOPUP_PRESETS, checkTopUp } from '../../../libs/points';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { useGlobals } from '../../hooks/useGlobals';
import MemberService from '../../services/MemberService';

/** The member's balance and a form to add free demo points. Points are not money. */
export default function BalanceCard() {
	const { authMember, setAuthMember } = useGlobals();
	const balance = authMember?.memberPoints ?? 0;
	const [amount, setAmount] = useState('');
	const [error, setError] = useState('');
	const [saving, setSaving] = useState(false);

	const pick = (n: number) => {
		setAmount(String(n));
		setError('');
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (saving) return;

		const check = checkTopUp(amount, balance);
		if (!check.ok) {
			setError(check.message);
			document.getElementById('balance-amount')?.focus(); // focus the first error
			return;
		}

		try {
			setSaving(true);
			const member = await new MemberService().topUp(check.amount);
			setAuthMember(member);
			setAmount('');
			setError('');
			await sweetTopSmallSuccessAlert(`Added ${check.amount.toLocaleString('en-US')} points`, 1500);
		} catch (err) {
			sweetErrorHandling(err).then();
		} finally {
			setSaving(false);
		}
	};

	return (
		<Paper
			component="section"
			id="balance"
			tabIndex={-1}
			elevation={0}
			className="balance-card"
			aria-labelledby="balance-title"
		>
			<Stack direction="row" alignItems="center" gap={1} className="balance-head">
				<EmojiEventsIcon sx={{ color: '#F9A825' }} aria-hidden="true" />
				<h2 id="balance-title" className="balance-title">
					Balance
				</h2>
			</Stack>
			<p className="balance-value" aria-live="polite">
				<strong>{balance.toLocaleString('en-US')}</strong> points
			</p>

			<div role="group" aria-label="Points to add" className="balance-presets">
				{TOPUP_PRESETS.map((n) => (
					<button
						key={n}
						type="button"
						className="balance-preset"
						aria-pressed={amount === String(n)}
						onClick={() => pick(n)}
					>
						+{n.toLocaleString('en-US')}
					</button>
				))}
			</div>

			<form className="balance-form" noValidate onSubmit={submit}>
				<label className="label" htmlFor="balance-amount">
					Or enter an amount
				</label>
				<div className="balance-row">
					<input
						id="balance-amount"
						className="input"
						type="text"
						inputMode="numeric"
						autoComplete="off"
						placeholder={`1 to ${MAX_TOPUP.toLocaleString('en-US')}`}
						value={amount}
						aria-invalid={!!error}
						aria-describedby={error ? 'balance-amount-error' : 'balance-note'}
						onChange={(e) => {
							setAmount(e.target.value);
							if (error) setError('');
						}}
					/>
					<Button type="submit" variant="contained" className="save-btn" disabled={saving} startIcon={<AddIcon />}>
						{saving ? 'Adding…' : 'Add points'}
					</Button>
				</div>
				{error && (
					<span id="balance-amount-error" className="field-error" role="alert">
						{error}
					</span>
				)}
			</form>
			<p id="balance-note" className="balance-note">
				Demo store: points are free, no real money.
			</p>
		</Paper>
	);
}
