import { IStockExecutionItem } from '@src/recoil/stockExecution';
import React from 'react';
import { useRecoilValue } from 'recoil';
import StockExecution from '@recoil/stockExecution/index';

interface Props {
	previousClose: number;
}

const translateTimestampFormat = (timestamp: number): string => {
	const stamp = new Date(timestamp);
	const month = `00${stamp.getMonth() + 1}`.slice(-2);
	const day = `00${stamp.getDate()}`.slice(-2);
	const hour = `00${stamp.getHours()}`.slice(-2);
	const minute = `00${stamp.getMinutes()}`.slice(-2);

	return `${month}.${day} ${hour}:${minute}`;
};

const colorPicker = (prev: number, current: number): string => {
	if (prev > current) return 'down';
	if (prev < current) return 'up';
	return '';
};

const Ticks = (props: Props) => {
	const { previousClose } = props;
	const stockExecutionState = useRecoilValue(StockExecution);

	return (
		<>
			<header className="conclusion-header">
				<div className="conclusion-timestamp">체결시간</div>
				<div className="conclusion-single-price">체결가격(원)</div>
				<div className="conclusion-volume">체결량(주)</div>
				<div className="conclusion-total-price">체결금액(원)</div>
			</header>
			<div className="conclusion-content">
				{stockExecutionState.executions.length === 0 ? (
					<p className="conclusion-notice-no-data">체결 정보가 없습니다.</p>
				) : (
					stockExecutionState.executions.map((log: IStockExecutionItem) => {
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
					})
				)}
			</div>
		</>
	);
};

export default Ticks;
