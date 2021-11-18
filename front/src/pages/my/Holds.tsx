import React from 'react';
import caretIcon from '@src/common/utils/caretIcon';
import formatInteger from '@src/common/utils/formatInteger';
import { IHold } from './IHold';
import './Holds.scss';

interface HoldsProps {
	holds: IHold[];
}

const Holds = (props: HoldsProps) => {
	const { holds } = props;

	const getHold = (hold: IHold) => {
		let status = ' ';
		if (hold.totalValuationProfit > 0) status = ' my__item--up';
		else if (hold.totalValuationProfit < 0) status = ' my__item--down';

		const profitRate = (hold.totalValuationPrice / hold.totalAskPrice) * 100 - 100;
		return (
			<div className="my__item" key={hold.stockCode}>
				<div>
					<span className="my__item-unit">{hold.stockCode}</span>
					<br />
					<span className="my__item-title">{hold.stockName}</span>
				</div>
				<div className="my__item-number">{hold.holdAmount.toLocaleString()}</div>
				<div className="my__item-number">{formatInteger(hold.averageAskPrice)}</div>
				<div className="my__item-number">{formatInteger(hold.totalAskPrice)}</div>
				<div className={`my__item-number${status}`}>{formatInteger(hold.totalValuationPrice)}</div>
				<div className={`my__item-number${status}`}>
					{caretIcon(profitRate)} {profitRate.toLocaleString(undefined, { maximumFractionDigits: 2 })} %
				</div>
			</div>
		);
	};

	return (
		<div className="my-holds">
			<div className="my__legend">
				<div>종목명</div>
				<div className="my__legend-number">보유수량 (주)</div>
				<div className="my__legend-number">평균매수가 (원)</div>
				<div className="my__legend-number">매수금액 (원)</div>
				<div className="my__legend-number">평가금액 (원)</div>
				<div className="my__legend-number">평가손익</div>
			</div>
			{holds.map((hold: IHold) => getHold(hold))}
		</div>
	);
};

export default Holds;
