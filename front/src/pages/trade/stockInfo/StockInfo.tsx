import React from 'react';

import './StockInfo.scss';

interface Props {
	info: Info;
}

export interface Info {
	name: string;
	price: number;
	percent: number;
	high: number;
	low: number;
	amount: number;
	volume: number;
}

const StockInfo = (props: Props) => {
	const { info } = props;
	const { name, price, percent, high, low, amount, volume } = info;

	let status = '';
	if (percent === 0) status = '';
	else if (percent > 0) status = 'up';
	else if (percent < 0) status = 'down';

	return (
		<div className="stock-info">
			<div className="stock-info__top ">
				<p className="stock-info__top-name">{name}</p>
				<p className={`stock-info__top-price ${status}`}>
					<p className="stock-info__top-price-value">
						{price.toLocaleString()}
					</p>
					<p className="stock-info__top-price-percent">
						{percent > 0 ? '+' : ''}
						{percent.toLocaleString()}%
					</p>
				</p>
			</div>
			<div className="stock-info__bottom">
				<div className="stock-info__bottom-data">
					<p className="stock-info__bottom-data-key">고가</p>
					<p className="stock-info__bottom-data-value">
						{high.toLocaleString()}
					</p>
				</div>
				<div className="stock-info__bottom-data">
					<p className="stock-info__bottom-data-key">저가</p>
					<p className="stock-info__bottom-data-value">
						{low.toLocaleString()}
					</p>
				</div>
				<div className="stock-info__bottom-data">
					<p className="stock-info__bottom-data-key">거래량</p>
					<p className="stock-info__bottom-data-value">
						{amount.toLocaleString()}
					</p>
				</div>
				<div className="stock-info__bottom-data">
					<p className="stock-info__bottom-data-key">거래대금</p>
					<p className="stock-info__bottom-data-value">
						{volume.toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
};

export default StockInfo;
