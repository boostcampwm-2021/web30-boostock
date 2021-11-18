import React, { useState, useRef, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IAskOrderItem, IBidOrderItem, askOrdersAtom, bidOrdersAtom } from '@recoil/stockOrders/index';
import bidAskPriceAtom from '@src/recoil/bidAskPrice/atom';
import formatNumber from '@src/common/utils/formatNumber';
import AskOrderItem from './AskOrderItem';
import BidOrderItem from './BidOrderItem';
import ITotalAndMaxAmount from './ITotalAndMaxAmount';

import './order.scss';

interface IProps {
	currentPrice: number;
}

function getPriceColorClass(price: number, currentPrice: number): string {
	if (price > currentPrice) return 'high';
	if (price < currentPrice) return 'low';
	return 'neutral';
}

function calculateTotalAndMaxAmount(askOrders: IAskOrderItem[], bidOrders: IBidOrderItem[]): ITotalAndMaxAmount {
	const totalAskAmount = askOrders.reduce((acc, { amount }) => acc + amount, 0);
	const totalBidAmount = bidOrders.reduce((acc, { amount }) => acc + amount, 0);
	const maxAmount = Math.max(...[...askOrders, ...bidOrders].map(({ amount }) => amount));

	return { totalAskAmount, totalBidAmount, maxAmount };
}

function isOrdersExist(askOrders: IAskOrderItem[], bidOrders: IBidOrderItem[]): boolean {
	return askOrders.length !== 0 || bidOrders.length !== 0;
}

function volumeWidth(amount: number, maxAmount: number): string {
	return `${(amount / maxAmount) * 100}%`;
}

const Order = ({ currentPrice }: IProps) => {
	const orderContentRef = useRef<HTMLDivElement>(null);
	const askOrders = useRecoilValue<IAskOrderItem[]>(askOrdersAtom);
	const bidOrders = useRecoilValue<IBidOrderItem[]>(bidOrdersAtom);

	const setBidAskPrice = useSetRecoilState(bidAskPriceAtom);
	const [totalAndMaxAmount, setTotalAndMaxVolumes] = useState(() => calculateTotalAndMaxAmount(askOrders, bidOrders));

	useEffect(() => {
		setTotalAndMaxVolumes(calculateTotalAndMaxAmount(askOrders, bidOrders));
	}, [askOrders, bidOrders]);

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
	}, [orderContentRef, askOrders, bidOrders]);

	if (!isOrdersExist(askOrders, bidOrders)) {
		return <p className="no-quotes-notice">호가 정보가 없습니다.</p>;
	}

	return (
		<div className="order-container">
			<div className="order-content" ref={orderContentRef}>
				<table className="order-table">
					<tbody>
						{askOrders.map((askOrder) => (
							<AskOrderItem
								key={askOrder.price}
								askOrder={askOrder}
								totalAndMaxAmount={totalAndMaxAmount}
								volumeWidth={volumeWidth}
								setBidAskPrice={setBidAskPrice}
								getPriceColorClass={getPriceColorClass}
								currentPrice={currentPrice}
							/>
						))}
						{bidOrders.map((bidOrder) => (
							<BidOrderItem
								key={bidOrder.price}
								bidOrder={bidOrder}
								totalAndMaxAmount={totalAndMaxAmount}
								volumeWidth={volumeWidth}
								setBidAskPrice={setBidAskPrice}
								getPriceColorClass={getPriceColorClass}
								currentPrice={currentPrice}
							/>
						))}
					</tbody>
				</table>
			</div>
			<div className="total-amount">
				<div className="total-sell-amount">{formatNumber(totalAndMaxAmount.totalAskAmount)}&nbsp;주</div>
				<div className="total-amount-text">총잔량</div>
				<div className="total-buy-amount">{formatNumber(totalAndMaxAmount.totalBidAmount)}&nbsp;주</div>
			</div>
		</div>
	);
};

export default Order;
