import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import formatNumber from '@src/common/utils/formatNumber';
import { withdraw } from '@lib/api';

interface WithdrawalProps {
	myBalance: number;
	refresh: () => void;
}

const Withdrawal = (props: WithdrawalProps) => {
	const { myBalance, refresh } = props;
	const [bank, setBank] = useState<string>('');
	const [account, setAccount] = useState<string>('');
	const [balance, setBalance] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const isValid = () => bank.length > 0 && account.length > 0 && balance.length > 0 && loading === false;

	const changeBank = (ev: ChangeEvent<HTMLInputElement>) => {
		setBank(ev.target.value);
	};

	const changeAccount = (ev: ChangeEvent<HTMLInputElement>) => {
		const value = ev.target.value.replace(/[^0-9\\-]/g, '');
		setAccount(value);
	};

	const changeBalance = (ev: ChangeEvent<HTMLInputElement>) => {
		const value = Number(ev.target.value.replace(/,/g, ''));
		if (Number.isInteger(value)) {
			setBalance(formatNumber(value));
		}
	};

	const submit = () => {
		if (!isValid()) return;

		(async () => {
			setLoading(true);

			try {
				const withdrawRes = await withdraw({
					bank,
					bankAccount: account,
					changeValue: Number(balance.replace(/,/g, '')),
				});
				if (!withdrawRes) throw new Error();

				toast.success('출금 신청이 완료되었습니다.');
				setBank('');
				setAccount('');
				setBalance('');
			} catch (error) {
				toast.error('출금 신청에 실패했습니다. 잠시 후에 재시도 해 주세요.');
			}

			setLoading(false);
			refresh();
		})();
	};

	return (
		<div className="balance__wrapper">
			<div className="balance__box balance__box--border">
				<b>출금 가능 금액</b>
				<br />₩ {myBalance.toLocaleString()}
			</div>
			<label className="balance__label" htmlFor="bank">
				은행명
				<input
					className="balance__input"
					type="text"
					id="bank"
					name="bank"
					maxLength={50}
					value={bank}
					onChange={changeBank}
				/>
			</label>
			<label className="balance__label" htmlFor="account">
				계좌번호
				<input
					className="balance__input"
					type="text"
					id="account"
					name="account"
					maxLength={50}
					value={account}
					onChange={changeAccount}
				/>
			</label>
			<label className="balance__label" htmlFor="balance">
				출금금액
				<input
					className="balance__input"
					type="text"
					id="balance"
					name="balance"
					maxLength={9}
					value={balance}
					onChange={changeBalance}
				/>
			</label>
			<div className="balance__box balance__box--fill">관리자 승인 후에 입력한 계좌 정보로 예치금이 출금됩니다.</div>
			<input type="button" className="balance__button" disabled={!isValid()} value="신청" onClick={submit} />
		</div>
	);
};

export default Withdrawal;
