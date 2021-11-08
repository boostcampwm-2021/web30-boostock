import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';

import StockList, { IStockListItem } from '@recoil/stockList/index';
import {
	translateRequestData,
	translateResponseData,
} from '@common/utils/socketUtils';
import webSocketAtom from '@src/recoil/websocket/atom';
import StockInfo from './stockInfo/StockInfo';
import SideBar from './sideBar/SideBar';
import BidAsk from './bidAsk/BidAsk';
import Conclusion from './conclusion/Conclusion';
import Order from './order/Order';
import './Trade.scss';

interface IConnection {
	type: string;
	stock?: string;
}

const Trade = () => {
	const location = useLocation();
	const queryData = QueryString.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const webSocket = useRecoilValue(webSocketAtom);
	const stockListState = useRecoilValue(StockList);
	const stockState =
		stockListState.find(
			(stock: IStockListItem) => stock.code === queryData.code,
		) || stockListState[0];
	const stockName = stockState.code;

	useEffect((): (() => void) => {
		if (webSocket.readyState === 1) {
			const openData: IConnection = {
				type: 'open',
				stock: stockName,
			};
			webSocket.send(translateRequestData(openData));
		}
		return () => {
			const closeData: IConnection = {
				type: 'close',
				stock: stockName,
			};
			webSocket.send(translateRequestData(closeData));
		};
	}, [webSocket, webSocket.readyState, stockName]);

	webSocket.onmessage = (event) => {
		console.log(translateResponseData(event.data));
	};
	webSocket.onerror = (event) => {};

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
							<Order />
						</section>
						<section className="trade-bid-ask">
							<BidAsk />
						</section>
					</section>
					<section className="trade-conclusion">
						<Conclusion
							previousClosingPrice={
								stockState.previousClosingPrice
							}
						/>
					</section>
				</section>
			</section>
		</main>
	);
};

export default Trade;
