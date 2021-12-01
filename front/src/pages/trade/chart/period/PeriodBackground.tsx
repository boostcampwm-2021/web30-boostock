import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@recoil/user';
import { IChartItem } from '@src/types';
import {
	TChartType,
	TTheme,
	MAKE_CLEAR_OFFSET,
	MAX_NUM_OF_CANDLES,
	CANDLE_GAP,
	formatCandleDate,
	getTextColor,
	getBorderColor,
	getLegendColor,
} from '../common';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 400;
const BOX_HEIGHT = 20;
const LEGEND_TOP = Math.floor(CANVAS_HEIGHT * 0.9);

interface IProps {
	chartData: IChartItem[];
	chartType: TChartType;
}

interface IDrawPeriodBackground {
	ctx: CanvasRenderingContext2D;
	chartData: IChartItem[];
	candleWidth: number;
	chartType: TChartType;
	theme: TTheme;
}

interface IDrawCandleDateArgs {
	ctx: CanvasRenderingContext2D;
	index: number;
	createdAt: number;
	candleWidth: number;
	numOfPartitions: number;
	chartType: TChartType;
}

const calculateNumOfPartitions = (numOfCandles: number) => {
	if (numOfCandles >= MAX_NUM_OF_CANDLES) return 20;
	if (numOfCandles >= MAX_NUM_OF_CANDLES * 0.8) return 15;
	if (numOfCandles >= MAX_NUM_OF_CANDLES * 0.65) return 10;
	if (numOfCandles >= MAX_NUM_OF_CANDLES * 0.4) return 5;
	if (numOfCandles >= MAX_NUM_OF_CANDLES * 0.3) return 4;
	return 3;
};

const drawCandleDate = ({ ctx, index, createdAt, candleWidth, numOfPartitions, chartType }: IDrawCandleDateArgs) => {
	if (index % numOfPartitions !== 0) return;

	const posX = Math.floor(CANVAS_WIDTH - (candleWidth + CANDLE_GAP) * (index + 1) + candleWidth / 2);

	ctx.beginPath();
	ctx.moveTo(posX + MAKE_CLEAR_OFFSET, 0);
	ctx.lineTo(posX + MAKE_CLEAR_OFFSET, LEGEND_TOP - 1);
	ctx.stroke();

	ctx.fillText(formatCandleDate(createdAt, chartType), posX, Math.floor(LEGEND_TOP + BOX_HEIGHT / 2));
};

const drawPeriodBackground = ({ ctx, chartData, candleWidth, chartType, theme }: IDrawPeriodBackground): void => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.font = '12px Lato';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.strokeStyle = getBorderColor(theme);
	ctx.beginPath();
	ctx.moveTo(CANVAS_WIDTH - MAKE_CLEAR_OFFSET, 0);
	ctx.lineTo(CANVAS_WIDTH - MAKE_CLEAR_OFFSET, LEGEND_TOP);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, LEGEND_TOP - MAKE_CLEAR_OFFSET);
	ctx.lineTo(CANVAS_WIDTH, LEGEND_TOP - MAKE_CLEAR_OFFSET);
	ctx.stroke();

	ctx.strokeStyle = getLegendColor(theme);
	ctx.fillStyle = getTextColor(theme);
	chartData.forEach(({ createdAt }, index) => {
		drawCandleDate({
			ctx,
			index,
			createdAt,
			candleWidth,
			numOfPartitions: calculateNumOfPartitions(chartData.length),
			chartType,
		});
	});
};

const PeriodBackground = ({ chartData, chartType }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const periodBackground = useRef<HTMLCanvasElement>(null);
	const numOfCandles = chartData.length;
	const candleWidth = (CANVAS_WIDTH - (numOfCandles + 1) * CANDLE_GAP) / numOfCandles;

	useEffect(() => {
		if (!periodBackground.current) return;

		const ctx = periodBackground.current.getContext('2d');
		if (!ctx) return;

		drawPeriodBackground({
			ctx,
			chartData,
			candleWidth,
			chartType,
			theme,
		});
	}, [periodBackground, chartData, chartType, theme]);

	return (
		<canvas className="chart-canvas chart-period-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={periodBackground} />
	);
};

export default PeriodBackground;
