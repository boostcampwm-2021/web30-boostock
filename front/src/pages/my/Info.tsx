import React, { useState, useEffect } from 'react';

import './Info.scss';

interface IInfo {
	balance: number;
	totalAskPrice: number;
	totalValuationPrice: number;
	totalValuationProfit: number;

	totalAssets: number;
	totalRate: number;
}

const Holds = () => {
	const [info, setInfo] = useState<IInfo | null>(null);

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user/info`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			console.log(res.ok);
			setInfo(null);
		});
	}, []);

	return (
		<div className="my-info">
			<div className="my-info__top">
				<div className="my-info__group">
					<div className="my-info__title--top">총자산</div>
					<div className="my-info__data--top">₩ {info?.totalAssets.toLocaleString() || '-'}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--top my-info__data--up">수익률</div>
					<div className="my-info__data--top my-info__data--up">
						{info?.totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '-'} %
					</div>
				</div>
			</div>
			<div className="my-info__bottom">
				<div className="my-info__group">
					<div className="my-info__title--bottom">현금자산</div>
					<div className="my-info__data--bottom">₩ {info?.balance || '-'}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom">총매수금액</div>
					<div className="my-info__data--bottom">₩ {info?.totalAskPrice || '-'}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom">총평가금액</div>
					<div className="my-info__data--bottom">₩ {info?.totalValuationPrice || '-'}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom ">총평가손익</div>
					<div className="my-info__data--bottom my-info__data--up">₩ {info?.totalValuationProfit || '-'}</div>
				</div>
			</div>
		</div>
	);
};

export default Holds;
