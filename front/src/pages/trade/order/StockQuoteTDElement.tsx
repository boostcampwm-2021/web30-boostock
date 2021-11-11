import React from 'react';
import { IStockQuoteItem } from '@src/recoil/stockQuote/atom';
import formatNumber from '@src/common/utils/formatNumber';

import './order.scss';

interface IProps {
	quote: IStockQuoteItem;
	totalAndMaxVolumes: {
		buyVolume: number;
		sellVolume: number;
		maxVolume: number;
	};
	setBidAskPrice: (arg: number) => void;
}

function sellVolumeBarClass(quoteType: number) {
	let result = 'order-row-volume sell-volume';
	if (quoteType === 0) result += ' active';

	return result;
}

function buyVolumeBarClass(quoteType: number) {
	let result = 'order-row-volume buy-volume';
	if (quoteType === 1) result += ' active';

	return result;
}

function backgroundColorClass(orderType: number): string {
	return orderType === 0 ? 'order-sell' : 'order-buy';
}

function volumeWidth(volume: number, maxVolume: number): string {
	return `${(volume / maxVolume) * 100}%`;
}

const StockQuoteTDElement = ({ quote, totalAndMaxVolumes, setBidAskPrice }: IProps) => {
	return (
		<>
			<td
				className={sellVolumeBarClass(quote.type)}
				{...(quote.type === 0 && {
					onClick: () => setBidAskPrice(quote.price),
				})}
			>
				{quote.type === 0 && (
					<>
						<div
							style={{
								width: volumeWidth(quote.volume, totalAndMaxVolumes.maxVolume),
							}}
							className="sell-volume-bar"
						>
							&nbsp;
						</div>
						<p className="volume-sell-text">{formatNumber(quote.volume)}</p>
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
				{...(quote.type === 1 && {
					onClick: () => setBidAskPrice(quote.price),
				})}
			>
				{quote.type === 1 && (
					<>
						<div
							style={{
								width: volumeWidth(quote.volume, totalAndMaxVolumes.maxVolume),
							}}
							className="buy-volume-bar"
						>
							&nbsp;
						</div>
						<p className="volume-buy-text">{formatNumber(quote.volume)}</p>
					</>
				)}
			</td>
		</>
	);
};

export default StockQuoteTDElement;
