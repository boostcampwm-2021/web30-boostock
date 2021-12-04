import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { BALANCE_TYPE, STATUS_TYPE, IUser, IHistory } from '@src/types';
import { userAtom } from '@recoil';
import { toDateString } from '@common/utils';
import { getBalance } from '@lib/api';
import { NINE_HOURS_IN_MILLISECONDS, ONE_MONTH_IN_MILLISECONDS } from '@common/constants';

import Deposit from './Deposit';
import Withdrawal from './Withdrawal';

import './Balance.scss';

enum TAB {
	DEPOSIT = '입금',
	WITHDRAWAL = '출금',
}

type TBalanceType = 'DEPOSIT' | 'WITHDRAWAL';
type TStatusType = 'PENDING' | 'PROCEEDING' | 'FINISHED' | 'CANCELED';

const translateBalanceTypeToKor = (type: TBalanceType) => {
	return type === 'DEPOSIT' ? '입금' : '출금';
};

const translateStatusTypeToKor = (type: TStatusType) => {
	const converter = { PENDING: '대기중', PROCEEDING: '처리중', FINISHED: '완료', CANCELED: '취소됨' };

	return converter[type] ?? '처리중';
};

const Balance = () => {
	const { isLoggedIn } = useRecoilValue<IUser>(userAtom);
	const [tab, setTab] = useState<TAB>(TAB.DEPOSIT);
	const [balance, setBalance] = useState<number>(0);
	const [histories, setHistories] = useState<IHistory[]>([]);

	const switchTab = (index: number) => setTab(Object.values(TAB)[index]);

	const getHistory = (history: IHistory) => {
		return (
			<tr className="my__item" key={history.createdAt}>
				<td>{translateBalanceTypeToKor(BALANCE_TYPE[history.type] as TBalanceType)}</td>
				<td>{history.bank}</td>
				<td>{history.bankAccount}</td>
				<td className="my__item-number">{history.volume.toLocaleString()}</td>
				<td className="my__item-number">{translateStatusTypeToKor(STATUS_TYPE[history.status] as TStatusType)}</td>
				<td className="my__item-number">{toDateString(history.createdAt + NINE_HOURS_IN_MILLISECONDS)}</td>
			</tr>
		);
	};

	const refresh = () => {
		const currentTime = Date.now();
		const beforeTime = currentTime - ONE_MONTH_IN_MILLISECONDS;

		(async () => {
			const balanceData = await getBalance(beforeTime, currentTime);
			if (!balanceData) return;

			const { balance, log } = balanceData;
			setBalance(balance);
			setHistories(log);
		})();
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
				<table className="my__balance">
					<thead className="my__legend">
						<tr className="my-legend-row">
							<th className="my__legend-left">종류</th>
							<th className="my__legend-left">은행</th>
							<th>계좌번호</th>
							<th className="my__legend-number">금액 (원)</th>
							<th className="my__legend-number">상태</th>
							<th className="my__legend-number">승인시간</th>
						</tr>
					</thead>
					<tbody className="balance-items">
						{histories.length > 0 ? (
							histories.map((history: IHistory) => getHistory(history))
						) : (
							<tr className="my__item">
								<td className="my__item-center">입출금 내역이 없습니다.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Balance;
