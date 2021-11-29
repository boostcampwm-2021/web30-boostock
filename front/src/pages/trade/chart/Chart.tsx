/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import chartAtom, { IChartItem } from '@recoil/chart/index';
import { IStockListItem, IStockChartItem } from '@recoil/stockList/index';
import { ICrossLine, TChartType } from './common';
import fetchChartData from './fetchChartData';
import PeriodBackground from './PeriodBackground';
import CandleGraph from './CandleGraph';
import VolumeGraph from './VolumeGraph';
import PeriodLegend from './PeriodLegend';

import './Chart.scss';

interface IProps {
	stockCode: string;
	stockState: IStockListItem;
}

interface ISliceIndex {
	start: number;
	end: number;
	lastIndex: number;
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

const Chart = ({ stockCode, stockState }: IProps) => {
	const chartRef = useRef<HTMLDivElement>(null);
	const [chart, setChart] = useRecoilState<IChartItem[]>(chartAtom);
	const [isUserGrabbing, setIsUserGrabbing] = useState<boolean>(false);
	const [sliceIndex, setSliceIndex] = useState<ISliceIndex>({
		start: DEFAULT_START_INDEX,
		end: DEFAULT_END_INDEX,
		lastIndex: DEFAULT_END_INDEX,
	});
	const [crossLine, setCrossLine] = useState<ICrossLine>({ event: null, posX: 0, posY: 0 });
	const [chartType, setChartType] = useState<TChartType>(getChartTypeFromLocalStorage);

	const handleSetChartType = (type: TChartType) => {
		window.localStorage.setItem('chartType', type.toString());
		setChartType(type);
	};

	const resetChart = () => {
		setChart(() => [
			{
				createdAt: Date.now(),
				priceStart: 0,
				priceEnd: 0,
				priceLow: 0,
				priceHigh: 0,
				amount: 0,
			},
		]);
	};

	const updateChartData = async (stockCode: string, chartType: TChartType, endDate?: number) => {
		const newChartData = await fetchChartData(stockCode, chartType, endDate);
		setChart((prev) => [...prev, ...newChartData]);
	};

	const updateRealtimeCandle = (charts: IStockChartItem[], chartType: TChartType) => {
		const targetChart = charts.find(({ type }) => type === chartType);
		if (!targetChart) return;

		const newChart = {
			createdAt: Date.now(),
			priceStart: targetChart.priceStart,
			priceEnd: targetChart.priceEnd,
			priceLow: targetChart.priceHigh,
			priceHigh: targetChart.priceLow,
			amount: targetChart.amount,
		};

		setChart((prev) => [newChart, ...prev.slice(1, prev.length)]);
	};

	useEffect(() => {
		const zoomCandleChart = (e: WheelEvent) => {
			e.preventDefault();
			const numCandleUnit = e.deltaY > 0 ? NUM_OF_CANDLE_UNIT : -NUM_OF_CANDLE_UNIT;
			setSliceIndex((prev) => {
				const { start, end, lastIndex } = prev;
				let newEnd = end + numCandleUnit;
				if (newEnd - start < MIN_NUM_OF_CANDLES) newEnd = start + MIN_NUM_OF_CANDLES;
				if (newEnd - start > MAX_NUM_OF_CANDLES) newEnd = start + MAX_NUM_OF_CANDLES;

				if (newEnd >= lastIndex) {
					updateChartData(stockCode, chartType, chart[chart.length - 1].createdAt);
					return { ...prev, end: newEnd, lastIndex: lastIndex + DEFAULT_END_INDEX * 2 };
				}

				return { ...prev, end: newEnd };
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
		setSliceIndex({ start: DEFAULT_START_INDEX, end: DEFAULT_END_INDEX, lastIndex: DEFAULT_END_INDEX });
		resetChart();
		updateChartData(stockCode, chartType);
	}, [stockCode, chartType]);

	useEffect(() => {
		const { charts } = stockState;
		updateRealtimeCandle(charts, chartType);
	}, [stockState, chartType]);

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
						const { start, end, lastIndex } = prev;
						const numOfCandles = end - start;
						const newStart = start + moveIndex >= DEFAULT_START_INDEX ? start + moveIndex : DEFAULT_START_INDEX;
						const newEnd = newStart + numOfCandles;

						if (newEnd >= lastIndex) {
							updateChartData(stockCode, chartType, chart[chart.length - 1].createdAt);
							return { start: newStart, end: newEnd, lastIndex: lastIndex + DEFAULT_END_INDEX * 2 };
						}

						return {
							start: newStart >= DEFAULT_START_INDEX ? newStart : DEFAULT_START_INDEX,
							end: newEnd,
							lastIndex,
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
