/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import ChartAtom from '@src/recoil/chart/atom';
import { ICrossLine } from './common';

import PeriodBackground from './PeriodBackground';
import CandleGraph from './CandleGraph';
import VolumeGraph from './VolumeGraph';
import PeriodLegend from './PeriodLegend';

import './Chart.scss';

const NUM_OF_CANDLES = 60;

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
	const [chart, setChart] = useRecoilState(ChartAtom);
	const [start, setStart] = useState<number>(0); // 맨 오른쪽 캔들의 인덱스
	const [end, setEnd] = useState<number>(60); // 맨 왼쪽 캔들의 인덱스

	const [crossLine, setCrossLine] = useState<ICrossLine>({ event: null, posX: 0, posY: 0 });

	useEffect(() => {
		const bindedMoveCrossLine = moveCrossLine.bind(undefined, setCrossLine);

		chartRef.current?.addEventListener('mousemove', bindedMoveCrossLine);
		return () => {
			chartRef.current?.removeEventListener('mousemove', bindedMoveCrossLine);
		};
	}, []);

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
			}}
		>
			<PeriodBackground chartData={chart.slice(start, end + 1)} crossLine={crossLine} />
			<CandleGraph chartData={chart.slice(start, end + 1)} numOfCandles={NUM_OF_CANDLES} crossLine={crossLine} />
			<VolumeGraph chartData={chart.slice(start, end + 1)} crossLine={crossLine} />
			<PeriodLegend chartData={chart.slice(start, end + 1)} crossLine={crossLine} />
			<div className="chart-menu" />
		</div>
	);
};

export default Chart;
