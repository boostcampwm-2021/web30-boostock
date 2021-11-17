import React from 'react';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import webSocketAtom from '@recoil/websocket/atom';
import stockListAtom, { IStockListItem, IStockChartItem } from '@recoil/stockList/atom';
import stockQuoteAtom, { IStockQuoteItem } from './recoil/stockQuote/atom';
import { translateResponseData } from './common/utils/socketUtils';

interface IProps {
	children: React.ReactNode;
}

interface INonTargetStockData {
	code: string;
	price: number;
	amount: number;
}

interface ITargetStockData {
	code: string;
	price: number;
	amount: number;
	createdAt: Date;
}

interface IOrder {
	price: number;
	type: number;
	amount: number;
}

let reconnector: NodeJS.Timer;
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

function createNewOrderBar(quotes: IStockQuoteItem[], order: IStockQuoteItem): IStockQuoteItem[] {
	const quotesLength = quotes.length;
	if (quotesLength >= MAX_NUM_OF_ORDER_BARS) return quotes;

	const { type, price, amount } = order;
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

function updateNonTargetStock(stockList: IStockListItem[], data: INonTargetStockData): IStockListItem[] {
	const { code: stockCode, price, amount } = data;

	return stockList.map((stockItem) => {
		if (stockItem.code !== stockCode) return stockItem;

		const newChartsData: IStockChartItem[] = stockItem.charts.map((chartItem) => {
			return chartItem.type === 1
				? chartItem
				: {
						...chartItem,
						volume: chartItem.volume + price * amount,
				  };
		});

		return {
			...stockItem,
			price,
			amount,
			charts: newChartsData,
		};
	});
}

function updateTargetStock(
	stockList: IStockListItem[],
	data: ITargetStockData,
	currentChart: IStockChartItem[],
): IStockListItem[] {
	const { code: stockCode, price, amount } = data;

	return stockList.map((stockItem) => {
		const dailyChartData: IStockChartItem = currentChart.filter(
			({ type: chartType }: IStockChartItem) => chartType === 1440,
		)[0];
		if (stockItem.code !== stockCode) return stockItem;

		const newChartsData = stockItem.charts.map((chartItem) => {
			return chartItem.type === 1
				? chartItem
				: {
						...chartItem,
						volume: chartItem.volume + price * amount,
						amount: chartItem.amount + amount,
						priceLow: dailyChartData.priceLow,
						priceHigh: dailyChartData.priceHigh,
				  };
		});

		return {
			...stockItem,
			price,
			amount,
			charts: newChartsData,
		};
	});
}

function updateStockQuote(stockQuote: IStockQuoteItem[], order: IOrder): IStockQuoteItem[] {
	const { price: orderPrice, amount: orderAmount, type: orderType } = order;

	if (!isOrderBarExist(stockQuote, orderPrice)) return createNewOrderBar(stockQuote, order);

	return stockQuote.map((quote) =>
		quote.price === orderPrice && quote.type === orderType ? { ...quote, amount: quote.amount + orderAmount } : quote,
	);
}

const startSocket = (
	setSocket: SetterOrUpdater<WebSocket | null>,
	setStockList: SetterOrUpdater<IStockListItem[]>,
	setStockQuote: SetterOrUpdater<IStockQuoteItem[]>,
) => {
	const webSocket = new WebSocket(process.env.WEBSOCKET || '');

	webSocket.onopen = () => {
		setSocket(webSocket);
		clearInterval(reconnector);
	};
	webSocket.onclose = () => {
		clearInterval(reconnector);
		reconnector = setInterval(() => {
			startSocket(setSocket, setStockList, setStockQuote);
		}, 1000);
	};
	webSocket.onmessage = (event) => {
		const { type, data } = translateResponseData(event.data);
		switch (type) {
			case 'stocks_info': {
				setStockList(data);
				break;
			}
			case 'update_stock': {
				if (!data) return;
				setStockList((prev) => updateNonTargetStock(prev, data));
				break;
			}
			case 'update_target': {
				const { match: matchData, currentChart, order } = data;
				const { price, amount } = matchData ?? {};

				// 주문 접수 케이스
				if (order) {
					setStockQuote((prev) => updateStockQuote(prev, order));
				}

				// 주문 체결 케이스
				if (matchData && currentChart) {
					setStockQuote((prev) => {
						return prev
							.map((quote) => (quote.price === price ? { ...quote, amount: quote.amount - amount } : quote))
							.filter((quote) => quote.amount > 0);
					});

					setStockList((prev) => updateTargetStock(prev, matchData, currentChart));
				}

				break;
			}
			default:
		}
	};
	webSocket.onerror = (event) => {};
};

const Socket = ({ children }: IProps) => {
	const setSocket = useSetRecoilState(webSocketAtom);
	const setStockList = useSetRecoilState(stockListAtom);
	const setStockQuote = useSetRecoilState(stockQuoteAtom);

	startSocket(setSocket, setStockList, setStockQuote);

	return <>{children}</>;
};

export default Socket;
