import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';

import { IStockListItem } from '@recoil/stockList/index';
import { translateRequestData } from '@common/utils/socketUtils';
import webSocketAtom from '@src/recoil/websocket/atom';
import stockListAtom from '@src/recoil/stockList/atom';
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

const getStockState = (
	stockList: IStockListItem[],
	queryData: QueryString.ParsedQs,
) => {
	return (
		stockList.find(
			(stock: IStockListItem) => stock.code === queryData.code,
		) ?? stockList[0]
	);
};

const Trade = () => {
	const [stockList] = useRecoilState(stockListAtom);
	const location = useLocation();
	const queryData = QueryString.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const webSocket = useRecoilValue(webSocketAtom);
	const stockState = getStockState(stockList, queryData);
	const stockCode = stockState.code;

	const connection = setInterval(() => {
		if (webSocket?.readyState === 1) {
			console.log('open 보냄');
			const openData: IConnection = {
				type: 'open',
				stockCode,
			};
			webSocket.send(translateRequestData(openData));
			clearInterval(connection);
		}
	}, 100);

	useEffect(() => {
		return () => {
			clearInterval(connection);
		};
	}, [connection, stockCode, webSocket]);

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
						<Conclusion previousClose={stockState.previousClose} />
					</section>
				</section>
			</section>
		</main>
	);
};

export default Trade;
