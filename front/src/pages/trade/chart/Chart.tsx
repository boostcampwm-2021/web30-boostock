/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import { IStockListItem } from '@recoil/stockList';
import { ICrossLine, TChartType, PRICE_CANVAS_TOP_BOT_PADDING, VOLUME_CANVAS_TOP_BOT_PADDING } from './common';
import PeriodBackground from './period/PeriodBackground';
import CandleGraph from './candle/CandleGraph';
import VolumeGraph from './volume/VolumeGraph';
import PeriodLegend from './period/PeriodLegend';
import useChart from './hooks/useChart';

import './Chart.scss';

interface IProps {
	stockCode: string;
	stockState: IStockListItem;
}

const MOVE_INDEX_SLOW_WEIGHT = 8;
const NUM_OF_CANDLE_UNIT = 7;

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
	const [isUserGrabbing, setIsUserGrabbing] = useState<boolean>(false);
	const [chartType, setChartType] = useState<TChartType>(getChartTypeFromLocalStorage);
	const { chart, chartToRender, setSliceIndexAfterSlide, setSliceIndexAfterZoom } = useChart({
		stockState,
		stockCode,
		chartType,
	});
	const [crossLine, setCrossLine] = useState<ICrossLine>({ event: null, posX: 0, posY: 0 });

	const handleSetChartType = (type: TChartType) => {
		window.localStorage.setItem('chartType', type.toString());
		setChartType(type);
	};

	const getYPosition = (padding: number) => (maxValue: number, minValue: number, canvasHeight: number) => (value: number) =>
		padding + ((maxValue - value) / (maxValue - minValue)) * (canvasHeight - padding * 2);

	useEffect(() => {
		const zoomCandleChart = (e: WheelEvent) => {
			e.preventDefault();
			const candlesToZoom = e.deltaY > 0 ? NUM_OF_CANDLE_UNIT : -NUM_OF_CANDLE_UNIT;
			setSliceIndexAfterZoom(candlesToZoom);
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
					setSliceIndexAfterSlide(moveIndex);
				}}
			>
				<PeriodBackground chartData={chartToRender} />
				<CandleGraph
					chartData={chartToRender}
					crossLine={crossLine}
					getYPosition={getYPosition(PRICE_CANVAS_TOP_BOT_PADDING)}
				/>
				<VolumeGraph
					chartData={chartToRender}
					crossLine={crossLine}
					getYPosition={getYPosition(VOLUME_CANVAS_TOP_BOT_PADDING)}
				/>
				<PeriodLegend chartData={chartToRender} crossLine={crossLine} />
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
