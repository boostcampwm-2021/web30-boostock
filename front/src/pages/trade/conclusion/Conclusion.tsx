import React from 'react';
import { useRecoilValue } from 'recoil';
import StockExecution, {
	IStockExecutionItem,
} from '@recoil/stockExecution/index';
import './conclusion.scss';

interface Props {
	previousClosingPrice: number;
}

const colorPicker = (prev: number, current: number): string => {
	if (prev > current) return 'down';
	if (prev < current) return 'up';
	return '';
};

const translateTimestampFormat = (timestamp: string): string => {
	const stamp = new Date(timestamp);
	const month = `00${stamp.getMonth() + 1}`.slice(-2);
	const day = `00${stamp.getDay()}`.slice(-2);
	const hour = `00${stamp.getHours()}`.slice(-2);
	const minute = `00${stamp.getMinutes()}`.slice(-2);
	return `${month}.${day} ${hour}:${minute}`;
};

const Conclusion = (props: Props) => {
	const stockExecutionState = useRecoilValue(StockExecution);
	const { previousClosingPrice } = props;
	return (
		<div className="conclusion-container">
			<div className="conclusion-title">
				<div className="conclusion-tab conclusion-tab-clicked">
					체결
				</div>
				<div className="conclusion-tab">일별</div>
			</div>
			<div className="conclusion-head">
				<div className="conclusion-timestamp">체결시간</div>
				<div className="conclusion-single-price">체결가격(원)</div>
				<div className="conclusion-volumn">체결량(주)</div>
				<div className="conclusion-total-price">체결금액(원)</div>
			</div>
			<div className="conclusion-content">
				{stockExecutionState.map((log: IStockExecutionItem) => {
					const [day, time] = translateTimestampFormat(
						log.timestamp,
					).split(' ');
					return (
						<div className="conclusion-row" key={log.id}>
							<div className="conclusion-timestamp">
								<span className="timestamp-day">{day}</span>
								<span className="timestamp-time">{time}</span>
							</div>
							<div
								className={`conclusion-single-price ${colorPicker(
									previousClosingPrice,
									log.price,
								)}`}
							>
								{log.price.toLocaleString('ko-kr')}
							</div>
							<div
								className={`conclusion-volumn ${
									log.type === 'bid' ? 'up' : 'down'
								}`}
							>
								{log.volume.toLocaleString('ko-kr')}
							</div>
							<div className="conclusion-total-price">
								{log.amount.toLocaleString('ko-kr')}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Conclusion;
