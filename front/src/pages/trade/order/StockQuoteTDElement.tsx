import React from 'react';
import { IStockQuoteItem } from '@src/recoil/stockQuote/atom';
import formatNumber from '@src/common/utils/formatNumber';

import style from './order.module.scss';

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
	let result = `${style['order-row-volume']} ${style['sell-volume']}`;
	if (quoteType === 0) result += ` ${style.active}`;

	return result;
}

function buyVolumeBarClass(quoteType: number) {
	let result = `${style['order-row-volume']} ${style['buy-volume']}`;
	if (quoteType === 1) result += ` ${style.active}`;

	return result;
}

function backgroundColorClass(orderType: number): string {
	return orderType === 0 ? style['order-sell'] : style['order-buy'];
}

function volumeWidth(volume: number, maxVolume: number): string {
	return `${(volume / maxVolume) * 100}%`;
}

const StockQuoteTDElement = ({
	quote,
	totalAndMaxVolumes,
	setBidAskPrice,
}: IProps) => {
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
								width: volumeWidth(
									quote.volume,
									totalAndMaxVolumes.maxVolume,
								),
							}}
							className={style['sell-volume-bar']}
						>
							&nbsp;
						</div>
						<p className={style['volume-sell-text']}>
							{formatNumber(quote.volume)}
						</p>
					</>
				)}
			</td>
			<td
				role="button"
				className={`${
					style['order-row-price-data']
				} ${backgroundColorClass(quote.type)}`}
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
								width: volumeWidth(
									quote.volume,
									totalAndMaxVolumes.maxVolume,
								),
							}}
							className={style['buy-volume-bar']}
						>
							&nbsp;
						</div>
						<p className={style['volume-buy-text']}>
							{formatNumber(quote.volume)}
						</p>
					</>
				)}
			</td>
		</>
	);
};

export default StockQuoteTDElement;
