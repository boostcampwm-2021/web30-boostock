import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import StockList, { IStockListItem } from '@recoil/stockList/index';
import { IHold } from './IHold';

import Info from './Info';
import Holds from './Holds';
import Transactions from './Transactions';
import Orders from './Orders';

import './My.scss';

enum TAB {
	HOLDS = '보유종목',
	TRANSACTIONS = '체결내역',
	ORDERS = '주문내역',
}

const My = () => {
	const stockListState = useRecoilValue(StockList);
	const { isLoggedIn } = useRecoilValue<IUser>(userAtom);
	const [tab, setTab] = useState<TAB>(TAB.HOLDS);
	const [holds, setHolds] = useState<IHold[]>([]);

	const switchTab = (index: number) => setTab(Object.values(TAB)[index]);

	const getCurrentTab = () => {
		switch (tab) {
			case TAB.HOLDS:
				return <Holds key={tab} holds={holds} />;
			case TAB.TRANSACTIONS:
				return <Transactions key={tab} />;
			case TAB.ORDERS:
				return <Orders key={tab} />;
			default:
				return <Holds key={tab} holds={holds} />;
		}
	};

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user/hold`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			res.json().then((data) => {
				setHolds(() => [
					...data.holdStocks.map(
						(stock: { amount: number; average: number; code: string; nameKorean: string; nameEnglish: string }) => {
							const valuationPrice =
								stockListState.find(
									(stockListStateItem: IStockListItem) => stock.code === stockListStateItem.code,
								)?.price || 0;

							return {
								stockCode: stock.code,
								stockName: stock.nameKorean,

								holdAmount: stock.amount,
								averageAskPrice: stock.average,
								totalAskPrice: stock.amount * stock.average,

								totalValuationPrice: stock.amount * valuationPrice,
								totalValuationProfit: stock.amount * valuationPrice - stock.amount * stock.average,
							};
						},
					),
				]);
			});
		});
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
