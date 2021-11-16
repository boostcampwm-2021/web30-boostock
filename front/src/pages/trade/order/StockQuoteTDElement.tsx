import React from 'react';
import { IStockQuoteItem } from '@src/recoil/stockQuote/atom';
import formatNumber from '@src/common/utils/formatNumber';

import './order.scss';

interface IProps {
	quote: IStockQuoteItem;
	totalAndMaxAmount: {
		buyAmount: number;
		sellAmount: number;
		maxAmount: number;
	};
	setBidAskPrice: (arg: number) => void;
}

function sellVolumeBarClass(quoteType: number) {
	let result = 'order-row-amount sell-amount';
	if (quoteType === 1) result += ' active';

	return result;
}

function buyVolumeBarClass(quoteType: number) {
	let result = 'order-row-amount buy-amount';
	if (quoteType === 2) result += ' active';

	return result;
}

function backgroundColorClass(orderType: number): string {
	return orderType === 1 ? 'order-sell' : 'order-buy';
}

function volumeWidth(amount: number, maxAmount: number): string {
	return `${(amount / maxAmount) * 100}%`;
}

const StockQuoteTDElement = ({ quote, totalAndMaxAmount, setBidAskPrice }: IProps) => {
	return (
		<>
			<td
				className={sellVolumeBarClass(quote.type)}
				{...(quote.type === 1 && {
					onClick: () => setBidAskPrice(quote.price),
				})}
			>
				{quote.type === 1 && (
					<>
						<div
							style={{
								width: volumeWidth(quote.amount, totalAndMaxAmount.maxAmount),
							}}
							className="sell-amount-bar"
						>
							&nbsp;
						</div>
						<p className="amount-sell-text">{formatNumber(quote.amount)}</p>
					</>
				)}
			</td>
			<td
				role="button"
				className={`order-row-price-data ${backgroundColorClass(quote.type)}`}
				onClick={() => setBidAskPrice(quote.price)}
				onKeyDown={() => setBidAskPrice(quote.price)}
				tabIndex={0}
			>
				{formatNumber(quote.price)}
			</td>
			<td
				className={buyVolumeBarClass(quote.type)}
				{...(quote.type === 2 && {
					onClick: () => setBidAskPrice(quote.price),
				})}
			>
				{quote.type === 2 && (
					<>
						<div
							style={{
								width: volumeWidth(quote.amount, totalAndMaxAmount.maxAmount),
							}}
							className="buy-amount-bar"
						>
							&nbsp;
						</div>
						<p className="amount-buy-text">{formatNumber(quote.amount)}</p>
					</>
				)}
			</td>
		</>
	);
};

export default StockQuoteTDElement;
