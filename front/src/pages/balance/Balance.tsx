import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import { BALANCETYPE, STATUSTYPE } from '@src/global';
import toDateString from '@src/common/utils/toDateString';

import Deposit from './Deposit';
import Withdrawal from './Withdrawal';

import './Balance.scss';

enum TAB {
	DEPOSIT = '입금',
	WITHDRAWAL = '출금',
}

interface IHistory {
	type: number;
	bank: string;
	bankAccount: string;
	volume: number;
	status: number;
	createdAt: number;
}

const Balance = () => {
	const { isLoggedIn } = useRecoilValue<IUser>(userAtom);
	const [tab, setTab] = useState<TAB>(TAB.DEPOSIT);
	const [balance, setBalance] = useState<number>(0);
	const [histories, setHistories] = useState<IHistory[]>([]);

	const switchTab = (index: number) => setTab(Object.values(TAB)[index]);

	const getHistory = (history: IHistory) => {
		return (
			<div className="my__item" key={history.createdAt}>
				<div>{BALANCETYPE[history.type]}</div>
				<div>{history.bank}</div>
				<div>{history.bankAccount}</div>
				<div className="my__item-number">{history.volume.toLocaleString()}</div>
				<div className="my__item-number">{STATUSTYPE[history.status]}</div>
				<div className="my__item-number">{toDateString(history.createdAt)}</div>
			</div>
		);
	};

	const refresh = () => {
		const currentTime = new Date().getTime();
		const beforeTime = currentTime - 1000 * 60 * 60 * 24 * 30;
		fetch(`${process.env.SERVER_URL}/api/user/balance?start=${beforeTime}&end=${currentTime}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			if (res.ok) {
				res.json().then((data) => {
					setBalance(data.balance || 0);
					setHistories(data.log || []);
				});
			}
		});
	};

	const getCurrentTab = () => {
		switch (tab) {
			case TAB.DEPOSIT:
				return <Deposit refresh={refresh} />;
			case TAB.WITHDRAWAL:
				return <Withdrawal myBalance={balance} refresh={refresh} />;
			default:
				return <Deposit refresh={refresh} />;
		}
	};

	useEffect(() => {
		refresh();
	}, []);

	if (!isLoggedIn) {
		return <Redirect to="/" />;
	}

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
					<div className="my__legend-number">승인시간</div>
				</div>
				<div className="balance-items">{histories.map((history: IHistory) => getHistory(history))}</div>
			</div>
		</div>
	);
};

export default Balance;
