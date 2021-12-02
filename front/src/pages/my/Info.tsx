import React, { useState, useEffect } from 'react';
import formatInteger from '@src/common/utils/formatInteger';
import { IUserHoldItem } from '@src/types';
import { ONE_MONTH_IN_MILLISECONDS } from '@common/constants';
import './Info.scss';

interface IInfo {
	balance: number;
	totalAskPrice: number;
	totalValuationPrice: number;
	totalValuationProfit: number;
	totalAssets: number;
	totalRate: number;
	status: string;
}

interface InfoProps {
	holds: IUserHoldItem[];
}

const Info = (props: InfoProps) => {
	const { holds } = props;
	const [info, setInfo] = useState<IInfo | null>(null);

	useEffect(() => {
		const currentTime = Date.now();
		const beforeTime = currentTime - ONE_MONTH_IN_MILLISECONDS;
		fetch(`${process.env.SERVER_URL}/api/user/balance?start=${beforeTime}&end=${currentTime}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		}).then((res: Response) => {
			if (res.ok) {
				res.json().then((data) => {
					const { balance } = data;
					const totalAskPrice = holds.reduce((prev, hold) => prev + hold.totalAskPrice, 0);
					const totalValuationPrice = holds.reduce((prev, hold) => prev + hold.totalValuationPrice, 0);
					const totalValuationProfit = totalValuationPrice - totalAskPrice;

					const totalAssets = balance + totalValuationPrice;
					const totalRate = (totalValuationPrice / totalAskPrice) * 100 - 100 || 0;

					let status = '';
					if (totalRate === 0) status = '';
					else if (totalRate > 0) status = ' my-info__data--up';
					else if (totalRate < 0) status = ' my-info__data--down';

					setInfo({
						balance,
						totalAskPrice,
						totalValuationPrice,
						totalValuationProfit,
						totalAssets,
						totalRate,
						status,
					});
				});
			}
		});
	}, [holds]);

	return (
		<div className="my-info">
			<div className="my-info__top">
				<div className="my-info__group">
					<div className="my-info__title--top">총자산</div>
					<div className="my-info__data--top">₩ {info?.totalAssets.toLocaleString() || '-'}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--top">수익률</div>
					<div className={`my-info__data--top${info?.status || ''}`}>
						{info?.totalRate.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '-'} %
					</div>
				</div>
			</div>
			<div className="my-info__bottom">
				<div className="my-info__group">
					<div className="my-info__title--bottom">현금자산</div>
					<div className="my-info__data--bottom">₩ {formatInteger(info?.balance || 0)}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom">총매수금액</div>
					<div className="my-info__data--bottom">₩ {formatInteger(info?.totalAskPrice || 0)}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom">총평가금액</div>
					<div className="my-info__data--bottom">₩ {formatInteger(info?.totalValuationPrice || 0)}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom ">총평가손익</div>
					<div className={`my-info__data--bottom ${info?.status || ''}`}>
						₩ {formatInteger(info?.totalValuationProfit || 0)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Info;
