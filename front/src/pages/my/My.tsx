import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { IUser, IStockListItem, IHoldStockItem, IUserHoldItem } from '@src/types';
import userAtom from '@recoil/user';
import StockList from '@recoil/stockList';
import fetchUserHold from './api/fetchUserHold';
import Info from './Info';
import Holds from './Holds';
import Transactions from './Transactions';
import Orders, { ORDERTYPE } from './Orders';

import './My.scss';

enum TAB {
	HOLDS = '보유종목',
	TRANSACTIONS = '체결내역',
	ORDERS_ASK = '매도내역',
	ORDERS_BID = '매수내역',
}

const calculateValuationPrice = (stockCode: string, stockList: IStockListItem[]) =>
	stockList.find((stockListStateItem: IStockListItem) => stockCode === stockListStateItem.code)?.price || 0;

const calculateUserValuationInfo = (stock: IHoldStockItem, stockList: IStockListItem[]) => {
	const valuationPrice = calculateValuationPrice(stock.code, stockList);

	return {
		stockCode: stock.code,
		stockName: stock.nameKorean,
		holdAmount: stock.amount,
		averageAskPrice: stock.average,
		totalAskPrice: stock.amount * stock.average,
		totalValuationPrice: stock.amount * valuationPrice,
		totalValuationProfit: stock.amount * valuationPrice - stock.amount * stock.average,
	};
};

const reCalculateUserValuationInfo = (userHold: IUserHoldItem, stockList: IStockListItem[]) => {
	const valuationPrice = calculateValuationPrice(userHold.stockCode, stockList);

	return {
		...userHold,
		totalValuationPrice: userHold.holdAmount * valuationPrice,
		totalValuationProfit: userHold.holdAmount * valuationPrice - userHold.holdAmount * userHold.averageAskPrice,
	};
};

const My = () => {
	const stockListState = useRecoilValue(StockList);
	const { isLoggedIn } = useRecoilValue<IUser>(userAtom);
	const [tab, setTab] = useState<TAB>(TAB.HOLDS);
	const [holds, setHolds] = useState<IUserHoldItem[]>([]);

	const switchTab = (index: number) => setTab(Object.values(TAB)[index]);

	const getCurrentTab = () => {
		switch (tab) {
			case TAB.HOLDS:
				return <Holds key={tab} holds={holds} />;
			case TAB.TRANSACTIONS:
				return <Transactions key={tab} />;
			case TAB.ORDERS_ASK:
				return <Orders key={tab} type={ORDERTYPE.매도} />;
			case TAB.ORDERS_BID:
				return <Orders key={tab} type={ORDERTYPE.매수} />;
			default:
				return <Holds key={tab} holds={holds} />;
		}
	};

	useEffect(() => {
		(async () => {
			const holdStocks = await fetchUserHold();
			if (holdStocks.length === 0) {
				setHolds([]);
				return;
			}

			setHolds(() => [...holdStocks.map((stock) => calculateUserValuationInfo(stock, stockListState))]);
		})();
	}, []);

	useEffect(() => {
		setHolds((prev) => [...prev.map((hold) => reCalculateUserValuationInfo(hold, stockListState))]);
	}, [stockListState]);

	if (!isLoggedIn) {
		return <Redirect to="/" />;
	}

	return (
		<div className="my">
			<div className="my__container">
				<Info holds={holds} />
			</div>
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
		</div>
	);
};

export default My;
