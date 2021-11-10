import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import webSocketAtom from '@recoil/websocket/atom';
import stockListAtom from '@recoil/stockList/atom';
import { translateResponseData } from './common/utils/socketUtils';

interface IProps {
	children: React.ReactNode;
}

interface IIncomingStockList {
	stock_id: number;
	code: string;
	name_english: string;
	name_korean: string;
	price: number;
	previous_close: number;
	unit: number;
}

const Socket = ({ children }: IProps) => {
	const webSocket = useRecoilValue(webSocketAtom);
	const setStockList = useSetRecoilState(stockListAtom);

	webSocket.onclose = () => {};

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

	return <>{children}</>;
};

export default Socket;
