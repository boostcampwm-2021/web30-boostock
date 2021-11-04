import React from 'react';
import { useRecoilValue } from 'recoil';
import { Redirect, RouteComponentProps } from 'react-router-dom';
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

type Props = RouteComponentProps<MatchParams>;

interface MatchParams {
	stockName: string;
}

const translateSocketData = (data: object | []) => JSON.stringify(data);

const Trade = ({ match }: Props) => {
	const stockListState = useRecoilValue(StockList);
	const stockState = stockListState.filter(
		(stock: IStockListItem) => stock.name === match.params.stockName,
	)[0];

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

	if (!stockState) {
		if (stockListState.length === 0) return <Redirect to="/" />;
		return <Redirect to={`/exchange/${stockListState[0].name}`} />;
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
					<section className="trade-chart">chart</section>
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
