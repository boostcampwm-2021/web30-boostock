/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import useChartData from './useChartData';
import { ICrossLine, TChartType } from './common';

import PeriodBackground from './PeriodBackground';
import CandleGraph from './CandleGraph';
import VolumeGraph from './VolumeGraph';
import PeriodLegend from './PeriodLegend';

import './Chart.scss';

interface IProps {
	stockCode: string;
}

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

const chartTypeMenuClass = (currentlySelectedType: TChartType, wantedType: TChartType) => {
	let result = 'chart-menu-item';
	if (currentlySelectedType === wantedType) result += ' selected';
	return result;
};

const chartContainerClass = (isUserGrabbing: boolean) => {
	let result = 'chart-container';
	if (isUserGrabbing) result += ' grabbing';

	return result;
};

const getChartTypeFromLocalStorage = (): TChartType => {
	let chartType = window.localStorage.getItem('chartType');
	if (chartType !== '1' && chartType !== '1440') chartType = '1';
	return Number(chartType) as TChartType;
};

const Chart = ({ stockCode }: IProps) => {
	const chartRef = useRef<HTMLDivElement>(null);
	const [isUserGrabbing, setIsUserGrabbing] = useState<boolean>(false);
	const [start, setStart] = useState<number>(DEFAULT_START_INDEX); // 맨 오른쪽 캔들의 인덱스
	const [end, setEnd] = useState<number>(DEFAULT_END_INDEX); // 맨 왼쪽 캔들의 인덱스
	const [offset, setOffset] = useState<number>(0);
	const [crossLine, setCrossLine] = useState<ICrossLine>({ event: null, posX: 0, posY: 0 });
	const [chartType, setChartType] = useState<TChartType>(getChartTypeFromLocalStorage);
	const chart = useChartData(stockCode, chartType, offset);

	const handleSetChartType = (type: TChartType) => {
		window.localStorage.setItem('chartType', type.toString());
		setChartType(type);
	};

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
	}, [stockCode, chartType]);

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
				<button type="button" className={chartTypeMenuClass(1, chartType)} onClick={() => handleSetChartType(1)}>
					1분
				</button>
				<button type="button" className={chartTypeMenuClass(1440, chartType)} onClick={() => handleSetChartType(1440)}>
					1일
				</button>
			</div>
		</div>
	);
};

export default Chart;
