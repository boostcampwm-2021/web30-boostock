import React from 'react';
import './conclusion.scss';

interface Props {}

interface ILog {
	day: string;
	time: string;
	total: number;
	volumn: number;
	single: number;
}

const logs: ILog[] = [
	{
		day: '11.04',
		time: '14:53',
		total: 74211000,
		volumn: 20,
		single: 74211000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
	{
		day: '11.04',
		time: '14:52',
		total: 74200000,
		volumn: 20,
		single: 74200000 / 20,
	},
];

const Conclusion = (props: Props) => {
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
				<div className="conclusion-total-price">체결가격(원)</div>
				<div className="conclusion-volumn">체결량(주)</div>
				<div className="conclusion-single-price">체결금액(원)</div>
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
							<div className="conclusion-total-price">
								{log.total.toLocaleString('ko-kr')}
							</div>
							<div className="conclusion-volumn">
								{log.volumn.toLocaleString('ko-kr')}
							</div>
							<div className="conclusion-single-price">
								{log.single.toLocaleString('ko-kr')}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Conclusion;
