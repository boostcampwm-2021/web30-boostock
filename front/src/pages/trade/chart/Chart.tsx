/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import ChartAtom, { IChartItem } from '@src/recoil/chart/atom';
import { ICrossLine } from './common';

import PeriodBackground from './PeriodBackground';
import CandleGraph from './CandleGraph';
import VolumeGraph from './VolumeGraph';
import PeriodLegend from './PeriodLegend';

import './Chart.scss';

const NUM_OF_CANDLES = 60;
const DEFAULT_START_INDEX = 0;
const DEFAULT_END_INDEX = 60;
const MOVE_INDEX_SLOW_WEIGHT = 4;

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

const Chart = () => {
	const chartRef = useRef<HTMLDivElement>(null);
	const [isUserGrabbing, setIsUserGrabbing] = useState<boolean>(false);
	const [chart, setChart] = useRecoilState<IChartItem[]>(ChartAtom);
	const [start, setStart] = useState<number>(DEFAULT_START_INDEX); // 맨 오른쪽 캔들의 인덱스
	const [end, setEnd] = useState<number>(DEFAULT_END_INDEX); // 맨 왼쪽 캔들의 인덱스

	const [crossLine, setCrossLine] = useState<ICrossLine>({ event: null, posX: 0, posY: 0 });

	useEffect(() => {
		const bindedMoveCrossLine = moveCrossLine.bind(undefined, setCrossLine);

		chartRef.current?.addEventListener('mousemove', bindedMoveCrossLine);
		return () => {
			chartRef.current?.removeEventListener('mousemove', bindedMoveCrossLine);
		};
	}, []);

	if (chart.length === 0) {
		return <p>차트 데이터가 없습니다.</p>;
	}

	return (
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
			}}
		>
			<PeriodBackground chartData={chart.slice(start, end)} crossLine={crossLine} />
			<CandleGraph chartData={chart.slice(start, end)} numOfCandles={NUM_OF_CANDLES} crossLine={crossLine} />
			<VolumeGraph chartData={chart.slice(start, end)} crossLine={crossLine} />
			<PeriodLegend chartData={chart.slice(start, end)} crossLine={crossLine} />
			<div className="chart-menu" />
		</div>
	);
};

export default Chart;
