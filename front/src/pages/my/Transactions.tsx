import React, { useState, LegacyRef } from 'react';
import { useRecoilValue } from 'recoil';
import { IStockListItem } from '@src/types';
import StockList from '@recoil/stockList';
import toDateString from '@src/common/utils/toDateString';
import { NINE_HOURS_IN_MILLISECONDS, ONE_MONTH_IN_MILLISECONDS } from '@common/constants';
import useInfinityScroll from './useInfinityScroll';

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

const refresh = (
	stockList: IStockListItem[],
	transactions: ITransaction[],
	setTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	setLoading(true);

	const currentTime = new Date().getTime();
	const beforeTime = currentTime - ONE_MONTH_IN_MILLISECONDS;
	const lastTime = transactions[transactions.length - 1]?.transactionTime || currentTime;
	fetch(`${process.env.SERVER_URL}/api/user/transaction?start=${beforeTime}&end=${Math.min(lastTime, currentTime)}`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	}).then((res: Response) => {
		if (res.ok) {
			res.json().then((data) => {
				setTransactions((prev) => [
					...prev,
					...data.log.map(
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
				]);

				if (data.log.length > 0) setLoading(false);
			});
		}
	});
};

const getTransaction = (transaction: ITransaction) => {
	let status = 'my__item-center';
	if (transaction.orderType === ORDERTYPE.매수) status += ' my__item--up';
	else if (transaction.orderType === ORDERTYPE.매도) status += ' my__item--down';

	return (
		<tr className="my__item" key={transaction.transactionTime + Math.random()}>
			<td>{toDateString(transaction.transactionTime + NINE_HOURS_IN_MILLISECONDS)}</td>
			<td className={status}>{ORDERTYPE[transaction.orderType]}</td>
			<td className="my__item-center">
				<span className="my__item-unit">{transaction.stockCode}</span>
				<br />
				<span className="my__item-title">{transaction.stockName}</span>
			</td>
			<td className="my__item-number">{transaction.amount.toLocaleString()}</td>
			<td className="my__item-number">{transaction.price.toLocaleString()}</td>
			<td className="my__item-number">{transaction.volume.toLocaleString()}</td>
		</tr>
	);
};

const Transactions = () => {
	const stockList = useRecoilValue<IStockListItem[]>(StockList);
	const [transactions, setTransactions] = useState<ITransaction[]>([]);
	const [rootRef, targetRef, loading] = useInfinityScroll(refresh.bind(undefined, stockList, transactions, setTransactions));

	return (
		<table className="my-transactions">
			<thead className="my__legend">
				<tr className="my-legend-row">
					<th className="my__legend-left">체결시간</th>
					<th className="my__legend-center">주문종류</th>
					<th className="my__legend-center">종목명</th>
					<th className="my__legend-number">거래수량 (주)</th>
					<th className="my__legend-number">거래단가 (원)</th>
					<th className="my__legend-number">거래금액 (원)</th>
				</tr>
			</thead>
			<tbody className="transaction-items" ref={rootRef as LegacyRef<HTMLTableSectionElement>}>
				{transactions.length > 0 ? (
					transactions.map((transaction: ITransaction) => getTransaction(transaction))
				) : (
					<tr className="my__item">
						<td className="my__item-center">거래 내역이 없습니다.</td>
					</tr>
				)}
				{loading === false && (
					<tr className="my__item" ref={targetRef as LegacyRef<HTMLTableRowElement>}>
						<td className="my__item-center" />
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default Transactions;
