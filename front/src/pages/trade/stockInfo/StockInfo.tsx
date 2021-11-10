import React, { useEffect } from 'react';
import { IStockListItem } from '@recoil/stockList/index';
import formatNumber from '@src/common/utils/formatNumber';
import caretIcon from '@src/common/utils/caretIcon';

import './StockInfo.scss';

interface Props {
	info: IStockListItem;
}

function priceColorClass(percent: number): string {
	if (percent < 0) return 'price-minus';
	if (percent > 0) return 'price-plus';
	return 'price-neutral';
}

function formatTradingData(data: number, postfix: string) {
	const ONE_THOUSAND = 1_000;
	const ONE_MILLION = 1_000_000;
	const ONE_BILLION = 1_000_000_000;

	if (data < ONE_MILLION) return `${formatNumber(data)}${postfix}`;
	if (data < ONE_BILLION)
		return `${formatNumber(Math.round(data / ONE_THOUSAND))}천${postfix}`;
	return `${formatNumber(Math.round(data / ONE_MILLION))}백만${postfix}`;
}

const StockInfo = ({ info }: Props) => {
	const { nameKorean, price, previousClose } = info;

	const percent = ((price - previousClose) / previousClose) * 100;

	useEffect(() => {
		document.title = `boostock/${nameKorean}`;

		return () => {
			document.title = 'boostock';
		};
	}, [nameKorean]);

	return (
		<div className="stock-info">
			<div className="stock-info__left">
				<header className="stock-name">{nameKorean}</header>
				<div
					className={`current-price-info ${priceColorClass(percent)}`}
				>
					<div className="current-price ">₩{formatNumber(price)}</div>
					<div className="price-percent">
						{caretIcon(percent)}
						{percent.toFixed(2)}%
					</div>
				</div>
			</div>
			<div className="stock-info__right">
				<div className="extra-info high-price">
					<span className="extra-info-data">
						{/* {formatNumber(highPrice)}원 */}0
					</span>
					<span className="extra-info-text">고가</span>
				</div>
				<div className="extra-info low-price">
					<span className="extra-info-data">
						{/* {formatNumber(lowPrice)}원 */}0
					</span>
					<span className="extra-info-text">저가</span>
				</div>
				<div className="extra-info trading-volume">
					<span className="extra-info-data">
						{/* {formatTradingData(tradingVolume, '주')} */}0
					</span>
					<span className="extra-info-text">거래량</span>
				</div>
				<div className="extra-info trading-amount">
					<span className="extra-info-data">
						{/* {formatTradingData(tradingAmount, '원')} */}0
					</span>
					<span className="extra-info-text">거래대금</span>
				</div>
			</div>
		</div>
	);
};

export default StockInfo;
