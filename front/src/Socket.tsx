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
			case 'stocks_info': {
				setStockList(data);
				break;
			}
			case 'update_stock': {
				const { code: stockCode, price, amount } = data;

				setStockList((prev) => {
					return prev.map((stockItem) => {
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
				});
				break;
			}
			case 'update_target': {
				const { match: matchData, currentChart } = data;
				const { code: stockCode, price, amount } = matchData;

				setStockList((prev) => {
					return prev.map((stockItem) => {
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
				});
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

	startSocket(setSocket, setStockList);

	return <>{children}</>;
};

export default Socket;
