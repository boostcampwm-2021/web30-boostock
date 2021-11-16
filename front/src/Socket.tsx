import React from 'react';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import webSocketAtom from '@recoil/websocket/atom';
import stockListAtom, { IStockListItem, IStockChartItem } from '@recoil/stockList/atom';
import { translateResponseData } from './common/utils/socketUtils';

interface IProps {
	children: React.ReactNode;
}

let reconnector: NodeJS.Timer;

const startSocket = (setSocket: SetterOrUpdater<WebSocket | null>, setStockList: SetterOrUpdater<IStockListItem[]>) => {
	const webSocket = new WebSocket(process.env.WEBSOCKET || '');
	webSocket.binaryType = 'arraybuffer';

	webSocket.onopen = () => {
		setSocket(webSocket);
		clearInterval(reconnector);
	};
	webSocket.onclose = () => {
		clearInterval(reconnector);
		reconnector = setInterval(() => {
			startSocket(setSocket, setStockList);
		}, 1000);
	};
	webSocket.onmessage = (event) => {
		const { type, data } = translateResponseData(event.data);
		switch (type) {
			case 'stocksInfo':
				console.log(new Date().getTime());
				setStockList(data);
				break;
			case 'updateStock':
				setStockList((prev) => {
					return prev.map((stockItem) => {
						if (stockItem.code !== data.code) return stockItem;

						const newChartsData: IStockChartItem[] = stockItem.charts.map((chartItem) => {
							return chartItem.type === 1
								? chartItem
								: {
										...chartItem,
										volume: chartItem.volume + data.price * data.amount,
								  };
						});

						return {
							...stockItem,
							price: data.price,
							amount: data.amount,
							charts: newChartsData,
						};
					});
				});
				break;
			case 'updateTarget':
				setStockList((prev) => {
					return prev.map((stockItem) => {
						const matchData = data.match;
						const dailyChartData: IStockChartItem = data.currentChart.filter(
							({ type: chartType }: IStockChartItem) => chartType === 1440,
						)[0];
						if (stockItem.code !== matchData.code) return stockItem;

						const newChartsData = stockItem.charts.map((chartItem) => {
							return chartItem.type === 1
								? chartItem
								: {
										...chartItem,
										volume: chartItem.volume + matchData.price * matchData.amount,
										amount: chartItem.amount + matchData.amount,
										priceLow: dailyChartData.priceLow,
										priceHigh: dailyChartData.priceHigh,
								  };
						});

						return {
							...stockItem,
							price: matchData.price,
							amount: matchData.amount,
							charts: newChartsData,
						};
					});
				});
				break;
			case 'baseStock':
				break;
			default:
		}
	};
	webSocket.onerror = (event) => {};
};

const Socket = ({ children }: IProps) => {
	const setSocket = useSetRecoilState(webSocketAtom);
	const setStockList = useSetRecoilState(stockListAtom);

	startSocket(setSocket, setStockList);

	return <>{children}</>;
};

export default Socket;
