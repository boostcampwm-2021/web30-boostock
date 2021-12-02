import React, { useState, useEffect } from 'react';
import formatInteger from '@src/common/utils/formatInteger';
import { IUserHoldItem } from '@src/types';
import { ONE_MONTH_IN_MILLISECONDS } from '@common/constants';
import { getBalance } from '@lib/api';
import './Info.scss';

interface IInfo {
	balance: number;
	totalAskPrice: number;
	totalValuationPrice: number;
	totalValuationProfit: number;
	totalAssets: number;
	totalRate: number;
}

interface IProps {
	holds: IUserHoldItem[];
}

const infoDataClass = (baseClass: string, value: number) => {
	if (value > 0) baseClass += ' my-info__data--up';
	if (value < 0) baseClass += ' my-info__data--down';
	return baseClass;
};

const calculateTotalValueOf = (propToCalculate: keyof IUserHoldItem, holds: IUserHoldItem[]) => {
	if (holds.length === 0) return 0;
	if (typeof holds[0][propToCalculate] === 'string') return 0;

	return holds.reduce((acc, current) => acc + (current[propToCalculate] as number), 0);
};

const Info = ({ holds }: IProps) => {
	const [info, setInfo] = useState<IInfo | null>(null);

	useEffect(() => {
		const currentTime = Date.now();
		const beforeTime = currentTime - ONE_MONTH_IN_MILLISECONDS;
		(async () => {
			const balanceData = await getBalance(beforeTime, currentTime);
			if (!balanceData) return;

			const { balance } = balanceData;
			const totalAskPrice = calculateTotalValueOf('totalAskPrice', holds);
			const totalValuationPrice = calculateTotalValueOf('totalValuationPrice', holds);
			const totalValuationProfit = totalValuationPrice - totalAskPrice;
			const totalAssets = balance + totalValuationPrice;
			const totalRate = (totalValuationPrice / totalAskPrice) * 100 - 100 || 0;

			setInfo({
				balance,
				totalAskPrice,
				totalValuationPrice,
				totalValuationProfit,
				totalAssets,
				totalRate,
			});
		})();
	}, [holds]);

	return (
		<div className="my-info">
			<div className="my-info__top">
				<div className="my-info__group">
					<div className="my-info__title--top">총자산</div>
					<div className="my-info__data--top">₩ {info?.totalAssets.toLocaleString() ?? '-'}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--top">수익률</div>
					<div className={infoDataClass('my-info__data--top', info?.totalRate ?? 0)}>
						{info?.totalRate.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '-'} %
					</div>
				</div>
			</div>
			<div className="my-info__bottom">
				<div className="my-info__group">
					<div className="my-info__title--bottom">현금자산</div>
					<div className="my-info__data--bottom">₩ {formatInteger(info?.balance ?? 0)}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom">총매수금액</div>
					<div className="my-info__data--bottom">₩ {formatInteger(info?.totalAskPrice ?? 0)}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom">총평가금액</div>
					<div className="my-info__data--bottom">₩ {formatInteger(info?.totalValuationPrice ?? 0)}</div>
				</div>
				<div className="my-info__group">
					<div className="my-info__title--bottom ">총평가손익</div>
					<div className={infoDataClass('my-info__data--bottom', info?.totalRate ?? 0)}>
						₩ {formatInteger(info?.totalValuationProfit ?? 0)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Info;
