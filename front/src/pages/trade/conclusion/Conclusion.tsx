import React from 'react';
import './conclusion.scss';

interface Props {
	previousClosingPrice: number;
}

interface ILog {
	day: string;
	time: string;
	single: number;
	volumn: number;
	total: number;
	type: string;
}

const logs: ILog[] = [
	{
		day: '11.04',
		time: '14:53',
		single: 74211000,
		volumn: 20,
		total: 74211000 * 20,
		type: 'bid',
	},
	{
		day: '11.04',
		time: '14:52',
		single: 74200000,
		volumn: 20,
		total: 74200000 * 20,
		type: 'bid',
	},
	{
		day: '11.04',
		time: '14:52',
		single: 74200000,
		volumn: 20,
		total: 74200000 * 20,
		type: 'ask',
	},
	{
		day: '11.04',
		time: '14:52',
		single: 74200000,
		volumn: 20,
		total: 74200000 * 20,
		type: 'bid',
	},
];

const colorPicker = (prev: number, current: number): string => {
	if (prev > current) return 'down';
	if (prev < current) return 'up';
	return '';
};

const Conclusion = (props: Props) => {
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
				{logs.map((log) => {
					return (
						<div className="conclusion-row">
							<div className="conclusion-timestamp">
								<span className="timestamp-day">{log.day}</span>
								<span className="timestamp-time">
									{log.time}
								</span>
							</div>
							<div
								className={`conclusion-single-price ${colorPicker(
									previousClosingPrice,
									log.single,
								)}`}
							>
								{log.single.toLocaleString('ko-kr')}
							</div>
							<div
								className={`conclusion-volumn ${
									log.type === 'bid' ? 'up' : 'down'
								}`}
							>
								{log.volumn.toLocaleString('ko-kr')}
							</div>
							<div className="conclusion-total-price">
								{log.total.toLocaleString('ko-kr')}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Conclusion;
