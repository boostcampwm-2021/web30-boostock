/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import useChartData from './useChartData';
import { ICrossLine } from './common';

import PeriodBackground from './PeriodBackground';
import CandleGraph from './CandleGraph';
import VolumeGraph from './VolumeGraph';
import PeriodLegend from './PeriodLegend';

import './Chart.scss';
import { Link } from 'react-router-dom';

const DEFAULT_START_INDEX = 0;
const DEFAULT_END_INDEX = 60;
const MOVE_INDEX_SLOW_WEIGHT = 8;

const moveCrossLine = (set: React.Dispatch<React.SetStateAction<ICrossLine>>, event: MouseEvent) => {
	set(() => ({
		event,
		posX: event.offsetX,
		posY: event.offsetY,
	}));
};

const isTarget = (target: HTMLElement) => !target.closest('.chart-menu');

const chartContainerClass = (isUserGrabbing: boolean) => {
	let result = 'chart-container';
	if (isUserGrabbing) result += ' grabbing';

	return result;
};

const Chart = ({ stockCode, stockType }: { stockCode: string; stockType: number }) => {
	const chartRef = useRef<HTMLDivElement>(null);
	const [isUserGrabbing, setIsUserGrabbing] = useState<boolean>(false);
	const [start, setStart] = useState<number>(DEFAULT_START_INDEX); // 맨 오른쪽 캔들의 인덱스
	const [end, setEnd] = useState<number>(DEFAULT_END_INDEX); // 맨 왼쪽 캔들의 인덱스
	const [offset, setOffset] = useState<number>(0);
	const [crossLine, setCrossLine] = useState<ICrossLine>({ event: null, posX: 0, posY: 0 });
	const chart = useChartData(stockCode, stockType, offset);

	useEffect(() => {
		const bindedMoveCrossLine = moveCrossLine.bind(undefined, setCrossLine);
		chartRef.current?.addEventListener('mousemove', bindedMoveCrossLine);
		return () => {
			chartRef.current?.removeEventListener('mousemove', bindedMoveCrossLine);
		};
	}, []);

	useEffect(() => {
		setStart(DEFAULT_START_INDEX);
		setEnd(DEFAULT_END_INDEX);
		setOffset(0);
	}, [stockCode, stockType]);

	if (chart.length === 0) {
		return <p>차트 데이터가 없습니다.</p>;
	}

	return (
		<div className="chart">
			<div
				className={chartContainerClass(isUserGrabbing)}
				ref={chartRef}
				role="main"
				onMouseDown={(e) => {
					if (!isTarget(e.target as HTMLDivElement)) return;

					setIsUserGrabbing(true);
				}}
				onMouseUp={(e) => {
					if (!isTarget(e.target as HTMLDivElement)) return;
					setIsUserGrabbing(false);
				}}
				onMouseMove={(e) => {
					if (!isTarget(e.target as HTMLDivElement)) return;
					if (!isUserGrabbing) return;

					const moveIndex = Math.floor(e.movementX / MOVE_INDEX_SLOW_WEIGHT);
					setStart((prev) => {
						const newIndex = prev + moveIndex;
						const numOfChartItems = chart.length;
						if (numOfChartItems - 1 < newIndex) return numOfChartItems - 1;

						return newIndex >= DEFAULT_START_INDEX ? newIndex : DEFAULT_START_INDEX;
					});
					setEnd((prev) => {
						const newIndex = prev + moveIndex;
						const numOfChartItems = chart.length;
						if (DEFAULT_END_INDEX + numOfChartItems - 1 < newIndex) return DEFAULT_END_INDEX + numOfChartItems - 1;

						return newIndex >= DEFAULT_END_INDEX ? newIndex : DEFAULT_END_INDEX;
					});
					setOffset((prev) => {
						return Math.max(prev, Math.ceil(start / DEFAULT_END_INDEX));
					});
				}}
			>
				<PeriodBackground chartData={chart.slice(start, end)} crossLine={crossLine} />
				<CandleGraph chartData={chart.slice(start, end)} crossLine={crossLine} />
				<VolumeGraph chartData={chart.slice(start, end)} crossLine={crossLine} />
				<PeriodLegend chartData={chart.slice(start, end)} crossLine={crossLine} />
			</div>
			<div className="chart-menu">
				<Link className="chart-menu-item" to={`?code=${stockCode}&type=1`}>
					1분봉
				</Link>
				<Link className="chart-menu-item" to={`?code=${stockCode}&type=1440`}>
					1일봉
				</Link>
			</div>
		</div>
	);
};

export default Chart;
