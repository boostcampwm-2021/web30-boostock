import React, { useState, useRef, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import bidAskPriceAtom from '@src/recoil/bidAskPrice/atom';
import stockQuoteAtom, { IStockQuoteItem } from '@src/recoil/stockQuote/atom';
import formatNumber from '@src/common/utils/formatNumber';
import StockQuoteTDElement from './StockQuoteTDElement';

import './order.scss';

function calculateTotalAndMaxVolumes(data: IStockQuoteItem[]) {
	const LENGTH = data.length;
	let buyVolume = 0;
	let sellVolume = 0;
	let maxVolume = 0;

	for (let i = 0; i < LENGTH; i += 1) {
		if (data[i].type === 1) sellVolume += data[i].volume;
		else buyVolume += data[i].volume;
		if (maxVolume < data[i].volume) maxVolume = data[i].volume;
	}

	return { buyVolume, sellVolume, maxVolume };
}

const Order = () => {
	const orderContentRef = useRef<HTMLDivElement>(null);
	const setBidAskPrice = useSetRecoilState(bidAskPriceAtom);
	const stockQuotes = useRecoilValue<IStockQuoteItem[]>(stockQuoteAtom);
	const [totalAndMaxVolumes, setTotalAndMaxVolumes] = useState(() => calculateTotalAndMaxVolumes(stockQuotes));

	useEffect(() => {
		setTotalAndMaxVolumes(calculateTotalAndMaxVolumes(stockQuotes));
	}, [stockQuotes]);

	useEffect(() => {
		if (!orderContentRef.current) return;

		const tableElem = orderContentRef.current.children[0] as HTMLTableElement;
		const tableHeight = tableElem.offsetHeight;
		const TABLE_MAX_HEIGHT = 470;
		const isOrderContentOverflowed = orderContentRef.current.scrollHeight - TABLE_MAX_HEIGHT > 0;
		let ORDER_CONTENT_LEFT_PADDING_SIZE = '6px';
		if (!isOrderContentOverflowed) ORDER_CONTENT_LEFT_PADDING_SIZE = '0px';

		orderContentRef.current.style.paddingLeft = ORDER_CONTENT_LEFT_PADDING_SIZE;

		orderContentRef.current.scrollTo(0, (tableHeight - TABLE_MAX_HEIGHT) / 2);
	}, [orderContentRef, stockQuotes]);

	if (stockQuotes.length === 0) {
		return <p className="no-quotes-notice">호가 정보가 없습니다.</p>;
	}

	return (
		<div className="order-container">
			<div className="order-content" ref={orderContentRef}>
				<table className="order-table">
					<tbody>
						{stockQuotes.map((quote) => (
							<tr key={quote.price} className="order-row">
								<StockQuoteTDElement
									quote={quote}
									totalAndMaxVolumes={totalAndMaxVolumes}
									setBidAskPrice={setBidAskPrice}
								/>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="total-volumes">
				<div className="total-sell-volume">{formatNumber(totalAndMaxVolumes.sellVolume)}&nbsp;주</div>
				<div className="total-volumes-text">총잔량</div>
				<div className="total-buy-volume">{formatNumber(totalAndMaxVolumes.buyVolume)}&nbsp;주</div>
			</div>
		</div>
	);
};

export default Order;
