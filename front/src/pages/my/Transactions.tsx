import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import StockList, { IStockListItem } from '@recoil/stockList/index';
import toDateString from '@src/common/utils/toDateString';

import './Transactions.scss';

export enum ORDERTYPE {
	매도 = 1,
	매수 = 2,
}

interface ITransaction {
	transactionTime: number;
	orderType: number;

	stockCode: string;
	stockName: string;

	price: number;
	amount: number;
	volume: number;
}

const Transactions = () => {
	const stockList = useRecoilValue<IStockListItem[]>(StockList);
	const [transactions, setTransactions] = useState<ITransaction[]>([]);

	useEffect(() => {
		const currentTime = new Date().getTime();
		const beforeTime = currentTime - 1000 * 60 * 60 * 24 * 30;
		fetch(`${process.env.SERVER_URL}/api/user/transaction?start=${beforeTime}&end=${currentTime}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			if (res.ok) {
				res.json().then((data) => {
					setTransactions(
						data.log.map(
							(log: { type: number; amount: number; createdAt: number; price: number; stockCode: string }) => {
								return {
									transactionTime: log.createdAt,
									orderType: log.type,
									stockCode: log.stockCode,
									stockName: stockList.find((stock) => stock.code === log.stockCode)?.nameKorean,
									price: log.price,
									amount: log.amount,
									volume: log.price * log.amount,
								};
							},
						),
					);
				});
			}
		});
	}, []);

	const getTransaction = (transaction: ITransaction) => {
		let status = ' ';
		if (transaction.orderType === ORDERTYPE.매수) status = ' my__item--up';
		else if (transaction.orderType === ORDERTYPE.매도) status = ' my__item--down';

		return (
			<div className="my__item" key={transaction.transactionTime}>
				<div>{toDateString(transaction.transactionTime)}</div>
				<div className={status}>{ORDERTYPE[transaction.orderType]}</div>
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
