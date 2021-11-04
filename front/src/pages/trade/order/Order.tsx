import React, { useState, useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import stockQuoteAtom, { IStockQuoteItem } from '@src/recoil/stockQuote/atom';
import formatNumber from '@src/common/utils/formatNumber';

import style from './order.module.scss';

function backgroundColorClass(orderType: number): string {
	return orderType === 0 ? style['order-sell'] : style['order-buy'];
}

function calculateTotalAndMaxVolumes(data: IStockQuoteItem[]) {
	const LENGTH = 20;
	let buyVolume = 0;
	let sellVolume = 0;
	let maxVolume = 0;

	for (let i = 0; i < LENGTH; i += 1) {
		if (data[i].type === 0) sellVolume += data[i].volume;
		else buyVolume += data[i].volume;
		if (maxVolume < data[i].volume) maxVolume = data[i].volume;
	}

	return { buyVolume, sellVolume, maxVolume };
}

function volumeWidth(volume: number, maxVolume: number): string {
	return `${(volume / maxVolume) * 100}%`;
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

const Order = () => {
	const tableRef = useRef<HTMLDivElement>(null);
	const stockQuotes = useRecoilValue<IStockQuoteItem[]>(stockQuoteAtom);
	const [totalAndMaxVolumes, setTotalAndMaxVolumes] = useState(() =>
		calculateTotalAndMaxVolumes(stockQuotes),
	);

	useEffect(() => {
		if (!tableRef.current) return;
		tableRef.current.scrollTo(0, 166);
	}, [tableRef]);

	return (
		<div className={style['order-container']}>
			<header className={style['order-header']}>호가정보</header>
			<div className={style['order-content']} ref={tableRef}>
				<table className={style['order-table']}>
					<tbody>
						{stockQuotes.map((quote) => (
							<tr key={quote.id} className={style['order-row']}>
								<td className={sellVolumeBarClass(quote.type)}>
									{quote.type === 0 && (
										<>
											<div
												style={{
													width: volumeWidth(
														quote.volume,
														totalAndMaxVolumes.maxVolume,
													),
												}}
												className={
													style['sell-volume-bar']
												}
											>
												&nbsp;
											</div>
											<p
												className={
													style['volume-sell-text']
												}
											>
												{formatNumber(quote.volume)}
											</p>
										</>
									)}
								</td>
								<td
									className={`${
										style['order-row-price-data']
									} ${backgroundColorClass(quote.type)}`}
								>
									{formatNumber(quote.price)}
								</td>

								<td className={buyVolumeBarClass(quote.type)}>
									{quote.type === 1 && (
										<>
											<div
												style={{
													width: volumeWidth(
														quote.volume,
														totalAndMaxVolumes.maxVolume,
													),
												}}
												className={
													style['buy-volume-bar']
												}
											>
												&nbsp;
											</div>
											<p
												className={
													style['volume-buy-text']
												}
											>
												{formatNumber(quote.volume)}
											</p>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={style['total-volumes']}>
				<div className={style['total-sell-volume']}>
					{formatNumber(totalAndMaxVolumes.sellVolume)}&nbsp;주
				</div>
				<div className={style['total-volumes-text']}>총잔량</div>
				<div className={style['total-buy-volume']}>
					{formatNumber(totalAndMaxVolumes.buyVolume)}&nbsp;주
				</div>
			</div>
		</div>
	);
};

export default Order;
