import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { ImSpinner8 } from 'react-icons/im';
import QueryString from 'qs';

import { IStockListItem } from '@recoil/stockList/index';
import { translateRequestData, translateResponseData } from '@common/utils/socketUtils';
import webSocketAtom from '@src/recoil/websocket/atom';
import stockListAtom from '@src/recoil/stockList/atom';
import stockQuoteAtom, { IStockQuoteItem } from '@src/recoil/stockQuote/atom';
import StockInfo from './stockInfo/StockInfo';
import SideBar from './sideBar/SideBar';
import BidAsk from './bidAsk/BidAsk';
import Conclusion from './conclusion/Conclusion';
import Order from './order/Order';
import './Trade.scss';

interface IConnection {
	type: string;
	stockCode?: string;
}

const MAX_NUM_OF_ORDER_BARS = 20;

// 해당 가격의 호가 막대가 존재하는지 판별
function isOrderBarExist(quotes: IStockQuoteItem[], orderPrice: number): boolean {
	return !!quotes.find(({ price }) => price === orderPrice);
}

function findNewOrderInsertIdx(quotes: IStockQuoteItem[], price: number): number {
	let left = 0;
	let right = quotes.length;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		if (quotes[mid].price < price) right = mid;
		else left = mid + 1;
	}

	return left;
}

function createNewOrderBar(quotes: IStockQuoteItem[], order: IStockQuoteItem, currentPrice: number): IStockQuoteItem[] {
	const quotesLength = quotes.length;
	if (quotesLength >= MAX_NUM_OF_ORDER_BARS) return quotes;

	const { type, price, amount } = order;
	if ((type === 1 && price < currentPrice) || (type === 2 && price > currentPrice)) return quotes;

	const insertIdx = findNewOrderInsertIdx(quotes, price);

	return [
		...quotes.slice(0, insertIdx),
		{
			type,
			price,
			amount,
		},
		...quotes.slice(insertIdx, quotesLength),
	];
}

const getStockState = (stockList: IStockListItem[], queryData: QueryString.ParsedQs) => {
	return stockList.find((stock: IStockListItem) => stock.code === queryData.code) ?? stockList[0];
};

const Trade = () => {
	const [stockList] = useRecoilState(stockListAtom);
	const setStockQuote = useSetRecoilState(stockQuoteAtom);
	const location = useLocation();
	const queryData = QueryString.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const webSocket = useRecoilValue(webSocketAtom);
	const stockState = getStockState(stockList, queryData);
	const stockCode = stockState?.code;
	const stockId = stockState?.stockId;

	function updateQuotes(event: MessageEvent) {
		if (!stockState) return;

		const { type, data } = translateResponseData(event.data);
		if (type !== 'update_target') return;

		const { order } = data;
		if (!order) return;

		const { price: orderPrice, amount: orderAmount, type: orderType } = order;

		setStockQuote((prev) => {
			if (!isOrderBarExist(prev, orderPrice)) return createNewOrderBar(prev, order, stockState.price);

			return prev.map((quote) =>
				quote.price === orderPrice && quote.type === orderType ? { ...quote, amount: quote.amount + orderAmount } : quote,
			);
		});
	}

	useEffect(() => {
		if (!stockId) return;
		(async () => {
			try {
				const bidAskOrdersRes = await fetch(`${process.env.SERVER_URL}/api/order/bid-ask?stockId=${stockId}`);
				if (bidAskOrdersRes.status !== 200) throw new Error('서버 에러');
				const bidAskOrdersData: IStockQuoteItem[] = await bidAskOrdersRes.json();

				setStockQuote(bidAskOrdersData.map((quote) => ({ ...quote, amount: Number(quote.amount) })));
			} catch (error) {
				// error handling logic goes here
			}
		})();
	}, [stockId]);

	useEffect(() => {
		if (!webSocket) return undefined;

		webSocket.addEventListener('message', updateQuotes);

		return () => {
			webSocket.removeEventListener('message', updateQuotes);
		};
	}, [webSocket, stockState]);

	useEffect(() => {
		const connection = setInterval(() => {
			if (!stockCode || webSocket?.readyState !== 1) return;
			const openData: IConnection = {
				type: 'open',
				stockCode,
			};
			webSocket.send(translateRequestData(openData));
			clearInterval(connection);
		});
		return () => {
			clearInterval(connection);
		};
	}, [webSocket, stockCode]);

	if (!stockCode) {
		return (
			<div className="trade__loading">
				<ImSpinner8 />
				<span>데이터 로딩중...</span>
			</div>
		);
	}

	return (
		<main className="trade">
			<section className="trade-container">
				<aside className="aside-bar">
					<SideBar />
				</aside>
				<section className="trade-body">
					<section className="trade-info">
						<StockInfo info={stockState} />
					</section>
					<section className="trade-chart">&nbsp;</section>
					<section className="trade-status">
						<section className="trade-order">
							<header className="order-header">호가정보</header>
							<Order />
						</section>
						<section className="trade-bid-ask">
							<BidAsk stockCode={stockCode} />
						</section>
					</section>
					<section className="trade-conclusion">
						<Conclusion previousClose={stockState.previousClose} />
					</section>
				</section>
			</section>
		</main>
	);
};

export default Trade;
