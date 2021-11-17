import React, { useState, useEffect } from 'react';

import Deposit from './Deposit';
import Withdrawal from './Withdrawal';

import './Balance.scss';

enum TAB {
	DEPOSIT = '입금',
	WITHDRAWAL = '출금',
}

interface IBalance {
	balanceType: string;

	bank: string;
	bankAccount: string;
	volume: number;
	status: string;
}

const Balance = () => {
	const [tab, setTab] = useState<TAB>(TAB.DEPOSIT);
	const [balances, setBalances] = useState<IBalance[]>([
		{
			balanceType: '입금',

			bank: '○○은행',
			bankAccount: '000-0000-0000-00',
			volume: 1234567,
			status: 'PENDING',
		},
	]);

	const switchTab = (index: number) => setTab(Object.values(TAB)[index]);

	const getCurrentTab = () => {
		switch (tab) {
			case TAB.DEPOSIT:
				return <Deposit />;
			case TAB.WITHDRAWAL:
				return <Withdrawal />;
			default:
				return <Deposit />;
		}
	};

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user/balances`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			console.log(res.ok);
			// setBalances([]);
		});
	}, []);

	const getBalance = (balance: IBalance) => {
		return (
			<div className="my__item" key={balance.bankAccount}>
				<div>{balance.balanceType}</div>
				<div>{balance.bank}</div>
				<div>{balance.bankAccount}</div>
				<div className="my__item-number">{balance.volume.toLocaleString()}</div>
				<div className="my__item-number">{balance.status}</div>
			</div>
		);
	};

	return (
		<div className="balance">
			<div className="my__container">
				<div className="my__tab">
					{Object.keys(TAB).map((key, index) => (
						<div
							key={key}
							className={`my__tab-item ${tab === TAB[key as keyof typeof TAB] ? 'selected' : ''}`}
							role="button"
							tabIndex={0}
							onClick={() => switchTab(index)}
							onKeyDown={() => switchTab(index)}
						>
							{Object.values(TAB)[index]}
						</div>
					))}
				</div>
				{getCurrentTab()}
			</div>

			<div className="my__container">
				<div className="my__tab">
					<div className="my__tab-item selected">입출금현황</div>
				</div>
				<div className="my__legend">
					<div>종류</div>
					<div>은행</div>
					<div>계좌번호</div>
					<div className="my__legend-number">금액 (원)</div>
					<div className="my__legend-number">상태</div>
				</div>
				{balances.map((balance: IBalance) => getBalance(balance))}
			</div>
		</div>
	);
};

export default Balance;
