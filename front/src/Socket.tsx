import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import webSocketAtom from '@recoil/websocket/atom';
import stockListAtom from '@recoil/stockList/atom';
import { translateResponseData } from './common/utils/socketUtils';

interface IProps {
	children: React.ReactNode;
}

const Socket = ({ children }: IProps) => {
	const webSocket = useRecoilValue(webSocketAtom);
	const setStockList = useSetRecoilState(stockListAtom);

	webSocket.onclose = () => {};

	webSocket.onmessage = (event) => {
		const { type, data } = translateResponseData(event.data);
		console.log(type, data);
		setStockList(data);
	};
	webSocket.onerror = (event) => {};

	return <>{children}</>;
};

export default Socket;
