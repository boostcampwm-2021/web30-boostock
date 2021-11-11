import React from 'react';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import webSocketAtom from '@recoil/websocket/atom';
import stockListAtom, { IStockListItem } from '@recoil/stockList/atom';
import { translateResponseData } from './common/utils/socketUtils';

interface IProps {
	children: React.ReactNode;
}

let reconnector: NodeJS.Timer;

const startSocket = (
	setSocket: SetterOrUpdater<WebSocket | null>,
	setStockList: SetterOrUpdater<IStockListItem[]>,
) => {
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
			case 'stocks_info':
				setStockList(
					data.map(
						({
							stock_id,
							code,
							name_english,
							name_korean,
							price,
							previous_close,
							unit,
						}: IIncomingStockList) => ({
							stockId: stock_id,
							code,
							nameEnglish: name_english,
							nameKorean: name_korean,
							price,
							previousClose: previous_close,
							unit,
						}),
					),
				);
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
