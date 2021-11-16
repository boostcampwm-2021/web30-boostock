import React, { useState, useRef, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import bidAskPriceAtom from '@src/recoil/bidAskPrice/atom';
import stockQuoteAtom, { IStockQuoteItem } from '@src/recoil/stockQuote/atom';
import formatNumber from '@src/common/utils/formatNumber';
import StockQuoteTDElement from './StockQuoteTDElement';

import './order.scss';

function calculateTotalAndMaxAmount(data: IStockQuoteItem[]) {
	const LENGTH = data.length;
	let buyAmount = 0;
	let sellAmount = 0;
	let maxAmount = 0;

	for (let i = 0; i < LENGTH; i += 1) {
		if (data[i].type === 1) sellAmount += data[i].amount;
		else buyAmount += data[i].amount;
		if (maxAmount < data[i].amount) maxAmount = data[i].amount;
	}

	return { buyAmount, sellAmount, maxAmount };
}

const Order = () => {
	const orderContentRef = useRef<HTMLDivElement>(null);
	const setBidAskPrice = useSetRecoilState(bidAskPriceAtom);
	const stockQuotes = useRecoilValue<IStockQuoteItem[]>(stockQuoteAtom);
	const [totalAndMaxAmount, setTotalAndMaxVolumes] = useState(() => calculateTotalAndMaxAmount(stockQuotes));

	useEffect(() => {
		setTotalAndMaxVolumes(calculateTotalAndMaxAmount(stockQuotes));
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
									totalAndMaxAmount={totalAndMaxAmount}
									setBidAskPrice={setBidAskPrice}
								/>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="total-amount">
				<div className="total-sell-amount">{formatNumber(totalAndMaxAmount.sellAmount)}&nbsp;주</div>
				<div className="total-amount-text">총잔량</div>
				<div className="total-buy-amount">{formatNumber(totalAndMaxAmount.buyAmount)}&nbsp;주</div>
			</div>
		</div>
	);
};

export default Order;
