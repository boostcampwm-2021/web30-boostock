import React, { useEffect, useRef } from 'react';
import { IChartItem } from '@src/recoil/chart/atom';

import { ICrossLine } from './common';
import CandleBackground from './CandleBackground';
import CandleLegend from './CandleLegend';
import './Chart.scss';

interface IProps {
	chartData: IChartItem[];
	readonly numOfCandles: number;
	crossLine: ICrossLine;
}

interface IDrawData {
	chartData: IChartItem[];
	ctx: CanvasRenderingContext2D;
	readonly canvasWidth: number;
	readonly candleWidth: number;
	readonly tailWidth: number;
	readonly maxPrice: number;
	readonly pixelsPerUnitWon: number;
}

interface ICandleBarDrawData {
	ctx: CanvasRenderingContext2D;
	x: number;
	y: number;
	width: number;
	height: number;
}

interface ICandleTailDrawData {
	ctx: CanvasRenderingContext2D;
	x: number;
	upperTailY: number;
	lowerTailY: number;
	width: number;
	upperTailHeight: number;
	lowerTailHeight: number;
}

const NUM_OF_HEIGHT_UNITS = 1000; // 차트 높이를 몇 칸으로 쪼갤것인가?

const getMaxPriceAndMinPrice = (chartData: IChartItem[]): { maxPrice: number; minPrice: number } => {
	const maxPrice = Math.max(...chartData.map(({ priceHigh }) => priceHigh));
	const minPrice = Math.min(...chartData.map(({ priceLow }) => priceLow));

	return { maxPrice, minPrice };
};

const isDodgeCandle = (priceStart: number, priceEnd: number): boolean => priceStart === priceEnd;

const isPositiveCandle = (priceStart: number, priceEnd: number): boolean => {
	return priceStart < priceEnd;
};

const drawCandleBar = ({ ctx, x, y, width, height }: ICandleBarDrawData) => {
	console.log(x, y, width, height);
	ctx.fillRect(0, y, width, height); // 캔들 봉
};

const drawCandleTails = ({ ctx, x, upperTailY, lowerTailY, width, upperTailHeight, lowerTailHeight }: ICandleTailDrawData) => {
	ctx.fillRect(x, upperTailY, width, upperTailHeight);
	ctx.fillRect(x, lowerTailY, width, lowerTailHeight);
};

const drawCandles = ({ chartData, ctx, canvasWidth, candleWidth, tailWidth, maxPrice, pixelsPerUnitWon }: IDrawData) => {
	chartData.forEach(({ priceHigh, priceLow, priceStart, priceEnd }, idx) => {
		if (isDodgeCandle(priceStart, priceEnd)) {
			return;
		}
		const isPositive = isPositiveCandle(priceStart, priceEnd);
		const candleColor = isPositive ? 'red' : 'blue';
		ctx.fillStyle = candleColor;

		const xPosOfCandleBar = canvasWidth - candleWidth * (idx + 1);
		const yPosOfCandleBar = (maxPrice - (isPositive ? priceEnd : priceStart)) / pixelsPerUnitWon;
		const candleHeight = Math.abs(priceStart - priceEnd) / pixelsPerUnitWon;

		const xPosOfCandleTail = xPosOfCandleBar + (candleWidth - tailWidth) / 2;
		const upperTailY = (maxPrice - priceHigh) / pixelsPerUnitWon;
		const lowerTailY = (maxPrice - priceLow) / pixelsPerUnitWon;
		const upperTailHeight = priceHigh - (isPositive ? priceEnd : priceStart);
		const lowerTailHeight = (isPositive ? priceStart : priceEnd) - priceLow;
		drawCandleBar({ ctx, x: xPosOfCandleBar, y: yPosOfCandleBar, width: candleWidth, height: candleHeight });
		drawCandleTails({ ctx, x: xPosOfCandleTail, upperTailY, lowerTailY, width: tailWidth, upperTailHeight, lowerTailHeight });
	});
};

const CandleGraph = ({ chartData, numOfCandles, crossLine }: IProps) => {
	const candleGraphChartRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!candleGraphChartRef.current) return;
		const CANVAS_WIDTH = candleGraphChartRef.current.clientWidth;
		const CANVAS_HEIGHT = candleGraphChartRef.current.clientHeight;
		const CANDLE_WIDTH = CANVAS_WIDTH / numOfCandles;
		const TAIL_WIDTH = 1;

		const ctx = candleGraphChartRef.current.getContext('2d');
		if (!ctx) return;

		const { maxPrice, minPrice } = getMaxPriceAndMinPrice(chartData);
		const pixelsPerUnitWon = (maxPrice - minPrice) / CANVAS_HEIGHT; // 1원당 높이 px

		drawCandles({
			chartData,
			ctx,
			canvasWidth: CANVAS_WIDTH,
			candleWidth: CANDLE_WIDTH,
			tailWidth: TAIL_WIDTH,
			maxPrice,
			pixelsPerUnitWon,
		});
	}, [candleGraphChartRef]);

	return (
		<>
			<CandleBackground chartData={chartData} crossLine={crossLine} />
			<canvas className="chart-canvas chart-candle-graph" ref={candleGraphChartRef} />
			<CandleLegend chartData={chartData} crossLine={crossLine} />
		</>
	);
};

export default CandleGraph;
