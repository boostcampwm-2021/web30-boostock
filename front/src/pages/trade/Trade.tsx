import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { ImSpinner8 } from 'react-icons/im';
import QueryString from 'qs';

import { IStockListItem } from '@recoil/stockList/index';
import { translateRequestData } from '@common/utils/socketUtils';
import webSocketAtom from '@src/recoil/websocket/atom';
import stockListAtom from '@src/recoil/stockList/atom';
import { IAskOrderItem, IBidOrderItem, askOrdersAtom, bidOrdersAtom } from '@recoil/stockOrders/index';
import StockInfo from './stockInfo/StockInfo';
import SideBar from './sideBar/SideBar';
import Chart from './chart/Chart';
import BidAsk from './bidAsk/BidAsk';
import Conclusion from './conclusion/Conclusion';
import Order from './order/Order';
import './Trade.scss';

interface IConnection {
	type: string;
	stockCode?: string;
}

interface IOrderApiRes {
	askOrders: IAskOrderItem[];
	bidOrders: IBidOrderItem[];
}

const getStockState = (stockList: IStockListItem[], queryData: QueryString.ParsedQs) => {
	return stockList.find((stock: IStockListItem) => stock.code === queryData.code) ?? stockList[0];
};

const Trade = () => {
	const [stockList] = useRecoilState(stockListAtom);
	const setAskOrders = useSetRecoilState(askOrdersAtom);
	const setBidOrders = useSetRecoilState(bidOrdersAtom);
	const location = useLocation();
	const queryData = QueryString.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const webSocket = useRecoilValue(webSocketAtom);
	const stockState = getStockState(stockList, queryData);
	const stockCode = stockState?.code;
	const stockId = stockState?.stockId;

	useEffect(() => {
		if (!stockId) return;
		(async () => {
			try {
				const bidAskOrdersRes = await fetch(`${process.env.SERVER_URL}/api/stock/bid-ask?stockId=${stockId}`);
				if (bidAskOrdersRes.status !== 200) throw new Error('서버 에러');
				const bidAskOrdersData: IOrderApiRes = await bidAskOrdersRes.json();
				const { askOrders, bidOrders } = bidAskOrdersData;

				setAskOrders(askOrders.map((askOrder) => ({ ...askOrder, amount: Number(askOrder.amount) })));
				setBidOrders(bidOrders.map((bidOrder) => ({ ...bidOrder, amount: Number(bidOrder.amount) })));
			} catch (error) {
				// error handling logic goes here
			}
		})();
	}, [stockId]);

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
					<section className="trade-chart">
						<Chart stockCode={stockCode} stockState={stockState} />
					</section>
					<section className="trade-status">
						<section className="trade-order">
							<header className="order-header">호가정보</header>
							<Order previousClose={stockState.previousClose ?? 0} />
						</section>
						<section className="trade-bid-ask">
							<BidAsk stockCode={stockCode} />
						</section>
					</section>
					<section className="trade-conclusion">
						<Conclusion previousClose={stockState.previousClose} stockCode={stockCode} />
					</section>
				</section>
			</section>
		</main>
	);
};

export default Trade;
