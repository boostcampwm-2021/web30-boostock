/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import { ICrossLine, TChartType } from './common';
import useChartData from './useChartData';
import PeriodBackground from './PeriodBackground';
import CandleGraph from './CandleGraph';
import VolumeGraph from './VolumeGraph';
import PeriodLegend from './PeriodLegend';

import './Chart.scss';

interface IProps {
	stockCode: string;
}

interface ISliceIndex {
	start: number;
	end: number;
	offset: number;
}

const DEFAULT_START_INDEX = 0;
const DEFAULT_END_INDEX = 60;
const MOVE_INDEX_SLOW_WEIGHT = 8;
const NUM_OF_CANDLE_UNIT = 7;
const MIN_NUM_OF_CANDLES = 10;
const MAX_NUM_OF_CANDLES = 120;

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
	const [sliceIndex, setSliceIndex] = useState<ISliceIndex>({ start: DEFAULT_START_INDEX, end: DEFAULT_END_INDEX, offset: 0 });
	const [crossLine, setCrossLine] = useState<ICrossLine>({ event: null, posX: 0, posY: 0 });
	const [chartType, setChartType] = useState<TChartType>(getChartTypeFromLocalStorage);
	const chart = useChartData(stockCode, chartType, sliceIndex.offset);

	const handleSetChartType = (type: TChartType) => {
		window.localStorage.setItem('chartType', type.toString());
		setChartType(type);
	};

	useEffect(() => {
		const zoomCandleChart = (e: WheelEvent) => {
			e.preventDefault();
			const numCandleUnit = e.deltaY > 0 ? NUM_OF_CANDLE_UNIT : -NUM_OF_CANDLE_UNIT;
			setSliceIndex((prev) => {
				const { start, end, offset } = prev;
				let newEnd = end + numCandleUnit;
				if (newEnd - start < MIN_NUM_OF_CANDLES) newEnd = start + MIN_NUM_OF_CANDLES;
				if (newEnd - start > MAX_NUM_OF_CANDLES) newEnd = start + MAX_NUM_OF_CANDLES;

				const newOffset = newEnd / DEFAULT_END_INDEX >= offset ? offset + 1 : offset;
				return { ...prev, end: newEnd, offset: newOffset };
			});
		};

		chartRef.current?.addEventListener('wheel', zoomCandleChart, { passive: false });

		return () => {
			chartRef.current?.removeEventListener('wheel', zoomCandleChart);
		};
	}, [chartRef, chart]);

	useEffect(() => {
		const bindedMoveCrossLine = moveCrossLine.bind(undefined, setCrossLine);
		chartRef.current?.addEventListener('mousemove', bindedMoveCrossLine);
		return () => {
			chartRef.current?.removeEventListener('mousemove', bindedMoveCrossLine);
		};
	}, []);

	useEffect(() => {
		setSliceIndex({ start: DEFAULT_START_INDEX, end: DEFAULT_END_INDEX, offset: 0 });
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
				onMouseOut={(e) => {
					if (!isTarget(e.target as HTMLDivElement)) return;
					setIsUserGrabbing(false);
				}}
				onBlur={(e) => {
					if (!isTarget(e.target as HTMLDivElement)) return;
					setIsUserGrabbing(false);
				}}
				onMouseMove={(e) => {
					if (!isTarget(e.target as HTMLDivElement)) return;
					if (!isUserGrabbing) return;

					const moveIndex = Math.floor(e.movementX / MOVE_INDEX_SLOW_WEIGHT);
					setSliceIndex((prev) => {
						const { start, end, offset } = prev;
						const numOfCandles = end - start;
						const newStart = start + moveIndex >= DEFAULT_START_INDEX ? start + moveIndex : DEFAULT_START_INDEX;
						const newEnd = newStart + numOfCandles;

						return {
							start: newStart >= DEFAULT_START_INDEX ? newStart : DEFAULT_START_INDEX,
							end: newEnd,
							offset: Math.max(offset, Math.ceil(start / DEFAULT_END_INDEX)),
						};
					});
				}}
			>
				<PeriodBackground chartData={chart.slice(sliceIndex.start, sliceIndex.end)} crossLine={crossLine} />
				<CandleGraph chartData={chart.slice(sliceIndex.start, sliceIndex.end)} crossLine={crossLine} />
				<VolumeGraph chartData={chart.slice(sliceIndex.start, sliceIndex.end)} crossLine={crossLine} />
				<PeriodLegend chartData={chart.slice(sliceIndex.start, sliceIndex.end)} crossLine={crossLine} />
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
