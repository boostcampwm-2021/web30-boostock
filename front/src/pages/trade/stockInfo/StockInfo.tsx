import React from 'react';
import { IStockListItem } from '@recoil/stockList/index';

import './StockInfo.scss';

interface Props {
	info: IStockListItem;
}

const StockInfo = (props: Props) => {
	const { info } = props;
	const {
		name,
		currentPrice,
		highPrice,
		lowPrice,
		previousClosingPrice,
		tradingVolume,
		tradingAmount,
	} = info;

	const percent =
		((currentPrice - previousClosingPrice) / previousClosingPrice) * 100;
	let status = '';
	if (percent === 0) status = '';
	else if (percent > 0) status = 'up';
	else if (percent < 0) status = 'down';

	return (
		<div className="stock-info">
			<div className="stock-info__top ">
				<p className="stock-info__top-name">{name}</p>
				<div className={`stock-info__top-price ${status}`}>
					<p className="stock-info__top-price-value">
						{currentPrice.toLocaleString()}
					</p>
					<p className="stock-info__top-price-percent">
						{percent > 0 ? '+' : ''}
						{percent.toFixed(1)}%
					</p>
				</div>
			</div>
			<div className="stock-info__bottom">
				<div className="stock-info__bottom-data stock-info__bottom-data--up">
					<p className="stock-info__bottom-data-key">고가</p>
					<p className="stock-info__bottom-data-value">
						{highPrice.toLocaleString()}
					</p>
				</div>
				<div className="stock-info__bottom-data  stock-info__bottom-data--down">
					<p className="stock-info__bottom-data-key">저가</p>
					<p className="stock-info__bottom-data-value">
						{lowPrice.toLocaleString()}
					</p>
				</div>
				<div className="stock-info__bottom-data">
					<p className="stock-info__bottom-data-key">거래량</p>
					<p className="stock-info__bottom-data-value">
						{tradingVolume.toLocaleString()} 주
					</p>
				</div>
				<div className="stock-info__bottom-data">
					<p className="stock-info__bottom-data-key">거래대금</p>
					<p className="stock-info__bottom-data-value">
						{tradingAmount.toLocaleString()} 원
					</p>
				</div>
			</div>
		</div>
	);
};

export default StockInfo;
