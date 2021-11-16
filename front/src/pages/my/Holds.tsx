import React, { useState, useEffect } from 'react';
import caretIcon from '@src/common/utils/caretIcon';

import './Holds.scss';

interface IHold {
	stockCode: string;
	stockName: string;

	holdAmount: number;
	averageAskPrice: number;
	totalAskPrice: number;

	totalValuationPrice: number;
	totalValuationProfit: number;
}

const Holds = () => {
	const [holds, setHolds] = useState<IHold[]>([
		{
			stockCode: 'HNX',
			stockName: '호눅스',

			holdAmount: 1234567,
			averageAskPrice: 1234567,
			totalAskPrice: 1234567,

			totalValuationPrice: 1234567,
			totalValuationProfit: 1234.567,
		},
	]);

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user/hold`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			console.log(res.ok);
			// setHolds([]);
		});
	}, []);

	const getHold = (hold: IHold) => {
		let status = ' ';
		if (hold.totalValuationProfit > 0) status = ' my__item--up';
		else if (hold.totalValuationProfit < 0) status = ' my__item--down';

		return (
			<div className="my__item" key={hold.stockCode}>
				<div>
					<span className="my__item-unit">{hold.stockCode}</span>
					<br />
					<span className="my__item-title">{hold.stockName}</span>
				</div>
				<div className="my__item-number">{hold.holdAmount.toLocaleString()}</div>
				<div className="my__item-number">{hold.averageAskPrice.toLocaleString()}</div>
				<div className="my__item-number">{hold.totalAskPrice.toLocaleString()}</div>
				<div className={`my__item-number${status}`}>{hold.totalValuationPrice.toLocaleString()}</div>
				<div className={`my__item-number${status}`}>
					{caretIcon(hold.totalValuationProfit)}{' '}
					{hold.totalValuationProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
				</div>
			</div>
		);
	};

	return (
		<div className="my-holds">
			<div className="my__legend">
				<div>종목명</div>
				<div className="my__legend-number">보유수량 (개)</div>
				<div className="my__legend-number">평균매수가 (원)</div>
				<div className="my__legend-number">매수금액 (원)</div>
				<div className="my__legend-number">평가금액 (원)</div>
				<div className="my__legend-number">평가손익 (%)</div>
			</div>
			{holds.map((hold: IHold) => getHold(hold))}
		</div>
	);
};

export default Holds;
