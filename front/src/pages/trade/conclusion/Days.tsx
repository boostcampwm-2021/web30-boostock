/* eslint-disable no-underscore-dangle */
import dailyLogAtom, { IDailyLog } from '@src/recoil/stockDailyLog/atom';
import React, { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';

interface Props {
	stockCode: string;
}

const translateTimestampFormat = (timestamp: number): string => {
	const stamp = new Date(timestamp);
	const month = `00${stamp.getMonth() + 1}`.slice(-2);
	const day = `00${stamp.getDate()}`.slice(-2);

	return `${month}.${day}`;
};

const colorPicker = (prev: number, current: number): string => {
	if (prev > current) return 'down';
	if (prev < current) return 'up';
	return '';
};
const getPriceRate = (prev: number, current: number): string => {
	const rate = ((current - prev) / prev) * 100 || 0;
	if (!prev || !Number.isFinite(rate)) return '-';
	return `${rate.toFixed(1)}%`;
};

const fetchDailyLog = async (stockCode: string, setDailyLog: SetterOrUpdater<IDailyLog[]>): Promise<void> => {
	const config: RequestInit = {
		method: 'GET',
		credentials: 'include',
	};
	const res = await fetch(`${process.env.SERVER_URL}/api/stock/log/daily?code=${stockCode}`, config);
	if (!res.ok) throw new Error('Fetch Failed Daily Log Error');

	const { code, logs } = await res.json();
	if (code === stockCode) setDailyLog(logs);
};

const Days = ({ stockCode }: Props) => {
	const [dailyLog, setDailyLog] = useRecoilState(dailyLogAtom);

	useEffect(() => {
		fetchDailyLog(stockCode, setDailyLog);
	}, [stockCode]);

	return (
		<>
			<header className="conclusion-header">
				<div className="conclusion-timestamp">일자</div>
				<div className="conclusion-single-price">종가(원)</div>
				<div className="conclusion-total-price">전일대비(%)</div>
				<div className="conclusion-volume">체결량(주)</div>
			</header>
			<div className="conclusion-content">
				{dailyLog.length === 0 ? (
					<p className="conclusion-notice-no-data">일별 정보가 없습니다.</p>
				) : (
					dailyLog.map((log: IDailyLog, index: number) => {
						if (dailyLog.length === 51 && index === dailyLog.length - 1) return <></>;
						const day = translateTimestampFormat(log.createdAt).split(' ');
						const colors = colorPicker(dailyLog[index + 1]?.priceEnd, log.priceEnd);
						return (
							<div className="conclusion-row" key={log._id}>
								<div className="conclusion-timestamp">
									<span className="timestamp-day">{day}</span>
								</div>
								<div className={`conclusion-single-price ${colors}`}>{log.priceEnd.toLocaleString('ko-kr')}</div>
								<div className={`conclusion-volume ${colors}`}>
									{getPriceRate(dailyLog[index + 1]?.priceEnd, log.priceEnd)}
								</div>
								<div className="conclusion-total-price">{log.amount.toLocaleString('ko-kr')}</div>
							</div>
						);
					})
				)}
			</div>
		</>
	);
};

export default Days;
