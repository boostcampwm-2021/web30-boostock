import React from 'react';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import webSocketAtom from '@recoil/websocket/atom';
import stockListAtom, { IStockListItem } from '@recoil/stockList/atom';
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
			case 'stocks_info':
				setStockList(
					data.map(({ stockId, code, nameEnglish, nameKorean, price, previousClose, unit }: IIncomingStockList) => ({
						stockId,
						code,
						nameEnglish,
						nameKorean,
						price,
						previousClose,
						unit,
					})),
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
