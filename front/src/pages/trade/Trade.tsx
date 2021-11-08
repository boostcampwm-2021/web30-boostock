import React from 'react';
import { useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';

import StockList, { IStockListItem } from '@recoil/stockList/index';
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

const translateSocketData = (data: object | []) => JSON.stringify(data);

const Trade = () => {
	const location = useLocation();
	const queryData = QueryString.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const stockListState = useRecoilValue(StockList);
	const stockState =
		stockListState.find(
			(stock: IStockListItem) => stock.code === queryData.code,
		) || stockListState[0];

	/*
	const webSocket = new WebSocket(process.env.WEBSOCKET || '');
	webSocket.onopen = () => {
		const data: IConnection = { type: 'open', stock: 'Boostock' };
		webSocket.send(translateSocketData(data));
	};
	webSocket.onclose = () => {};
	webSocket.onmessage = (event) => {};
	webSocket.onerror = (event) => {};
	*/

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
