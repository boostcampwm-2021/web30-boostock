import React, { useState, useEffect } from 'react';
import toDateString from '@src/common/utils/toDateString';

import './Transactions.scss';

interface ITransaction {
	transactionTime: number;
	orderType: string;

	stockCode: string;
	stockName: string;

	price: number;
	amount: number;
	volume: number;
}

const Transactions = () => {
	const [transactions, setTransactions] = useState<ITransaction[]>([
		{
			transactionTime: 1637043806237,
			orderType: '매도',
			stockCode: 'HNX',
			stockName: '호눅스',
			price: 1234567,
			amount: 1234567,
			volume: 1234567,
		},
	]);

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user/transactions`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			console.log(res.ok);
			// setTransactions([]);
		});
	}, []);

	const getTransaction = (transaction: ITransaction) => {
		let status = ' ';
		if (transaction.orderType === '매수') status = ' my__item--up';
		else if (transaction.orderType === '매도') status = ' my__item--down';

		return (
			<div className="my__item" key={transaction.transactionTime}>
				<div>{toDateString(transaction.transactionTime)}</div>
				<div className={status}>{transaction.orderType}</div>
				<div>
					<span className="my__item-unit">{transaction.stockCode}</span>
					<br />
					<span className="my__item-title">{transaction.stockName}</span>
				</div>
				<div className="my__item-number">{transaction.amount.toLocaleString()}</div>
				<div className="my__item-number">{transaction.price.toLocaleString()}</div>
				<div className="my__item-number">{transaction.volume.toLocaleString()}</div>
			</div>
		);
	};

	return (
		<div className="my-transactions">
			<div className="my__legend">
				<div>체결시간</div>
				<div>주문종류</div>
				<div>종목명</div>
				<div className="my__legend-number">거래수량 (주)</div>
				<div className="my__legend-number">거래단가 (원)</div>
				<div className="my__legend-number">거래금액 (원)</div>
			</div>

			{transactions.map((transaction: ITransaction) => getTransaction(transaction))}
		</div>
	);
};

export default Transactions;
