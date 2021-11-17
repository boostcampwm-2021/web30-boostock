import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import StockExecution, { IStockExecutionItem } from '@recoil/stockExecution/index';
import './conclusion.scss';

export enum TAB {
	TICK = '체결',
	DAY = '일별',
}

interface Props {
	previousClose: number;
}

const colorPicker = (prev: number, current: number): string => {
	if (prev > current) return 'down';
	if (prev < current) return 'up';
	return '';
};

const translateTimestampFormat = (timestamp: number): string => {
	const stamp = new Date(timestamp);
	const month = `00${stamp.getMonth() + 1}`.slice(-2);
	const day = `00${stamp.getDate()}`.slice(-2);
	const hour = `00${stamp.getHours()}`.slice(-2);
	const minute = `00${stamp.getMinutes()}`.slice(-2);

	return `${month}.${day} ${hour}:${minute}`;
};

const Conclusion = ({ previousClose }: Props) => {
	const [tab, setTab] = useState(TAB.TICK);
	const stockExecutionState = useRecoilValue(StockExecution);
	return (
		<div className="conclusion-container">
			<div className="conclusion-title">
				<button
					type="button"
					className={`conclusion-tab ${tab === TAB.TICK ? 'conclusion-tab-clicked' : ''}`}
					onClick={() => setTab(TAB.TICK)}
				>
					체결
				</button>
				<button
					type="button"
					className={`conclusion-tab ${tab === TAB.DAY ? 'conclusion-tab-clicked' : ''}`}
					onClick={() => setTab(TAB.DAY)}
				>
					일별
				</button>
			</div>
			<header className="conclusion-header">
				<div className="conclusion-timestamp">체결시간</div>
				<div className="conclusion-single-price">체결가격(원)</div>
				<div className="conclusion-volume">체결량(주)</div>
				<div className="conclusion-total-price">체결금액(원)</div>
			</header>
			<div className="conclusion-content">
				{stockExecutionState.map((log: IStockExecutionItem) => {
					const [day, time] = translateTimestampFormat(log.timestamp).split(' ');
					return (
						<div className="conclusion-row" key={log.id}>
							<div className="conclusion-timestamp">
								<span className="timestamp-day">{day}</span>
								<span className="timestamp-time">{time}</span>
							</div>
							<div className={`conclusion-single-price ${colorPicker(previousClose, log.price)}`}>
								{log.price.toLocaleString('ko-kr')}
							</div>
							<div className="conclusion-volume">{log.amount.toLocaleString('ko-kr')}</div>
							<div className="conclusion-total-price">{log.volume.toLocaleString('ko-kr')}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Conclusion;
