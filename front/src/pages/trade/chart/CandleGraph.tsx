import React, { useEffect, useRef } from 'react';
import { IChartItem } from '@src/recoil/chart/atom';

import { ICrossLine } from './common';
import CandleBackground from './CandleBackground';
import CandleLegend from './CandleLegend';
import { getMaxPriceAndMinPrice } from './common';
import './Chart.scss';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 280;
const TOP_BOTTOM_PADDING = 0;

interface IProps {
	chartData: IChartItem[];
	readonly numOfCandles: number;
	crossLine: ICrossLine;
}

interface IDrawData {
	chartData: Array<IChartItem>;
	ctx: CanvasRenderingContext2D;
	canvasWidth: number;
	candleWidth: number;
	candleGap: number;
	tailWidth: number;
	convertPriceToYPos: (curPrice: number) => number;
}

interface ICandleDrawData {
	ctx: CanvasRenderingContext2D;
	x: number;
	y: number;
	width: number;
	height: number;
}

const isDodgeCandle = (priceStart: number, priceEnd: number) => priceStart === priceEnd;

const isPositiveCandle = (priceStart: number, priceEnd: number) => priceStart < priceEnd;

const drawCandleBar = ({ ctx, x, y, width, height }: ICandleDrawData) => ctx.fillRect(x, y, width, height);

const drawCandleTail = ({ ctx, x, y, width, height }: ICandleDrawData) => ctx.fillRect(x, y, width, height);

const drawCandles = ({ chartData, ctx, canvasWidth, candleWidth, candleGap, tailWidth, convertPriceToYPos }: IDrawData) => {
	chartData.forEach(({ priceHigh, priceLow, priceStart, priceEnd }, idx) => {
		const isPositive = isPositiveCandle(priceStart, priceEnd);
		const candleBarX = canvasWidth - (candleWidth + candleGap) * (idx + 1);
		const candleBarY = convertPriceToYPos(isPositive ? priceEnd : priceStart);
		const candleHeight = Math.abs(convertPriceToYPos(priceStart) - convertPriceToYPos(priceEnd));

		const tailX = candleBarX + (candleWidth - tailWidth) / 2;
		const tailY = convertPriceToYPos(priceHigh);
		const tailHeight = convertPriceToYPos(priceLow) - tailY;

		if (isDodgeCandle(priceStart, priceEnd)) {
			ctx.fillStyle = 'black';
			drawCandleBar({ ctx, x: candleBarX, y: candleBarY, width: candleWidth, height: candleHeight + 1 });
			drawCandleTail({
				ctx,
				x: tailX,
				y: tailY,
				width: tailWidth,
				height: tailHeight,
			});
			return;
		}

		const candleColor = isPositive ? '#d60000' : '#0051c7';
		ctx.fillStyle = candleColor;

		drawCandleBar({ ctx, x: candleBarX, y: candleBarY, width: candleWidth, height: candleHeight });
		drawCandleTail({
			ctx,
			x: tailX,
			y: tailY,
			width: tailWidth,
			height: tailHeight,
		});
	});
};

const CandleGraph = ({ chartData, numOfCandles, crossLine }: IProps) => {
	const candleGraphChartRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!candleGraphChartRef.current) return;

		const ctx = candleGraphChartRef.current.getContext('2d');
		if (!ctx) return;

		const CANDLE_GAP = 5;
		const CANDLE_WIDTH = (CANVAS_WIDTH - (numOfCandles + 1) * CANDLE_GAP) / numOfCandles;
		const TAIL_WIDTH = 1;

		const { maxPrice, minPrice } = getMaxPriceAndMinPrice(chartData, 1.1, 0.9);

		const convertPriceToYPos = (curPrice: number) =>
			((maxPrice - curPrice) / (maxPrice - minPrice)) * (CANVAS_HEIGHT - TOP_BOTTOM_PADDING * 2) + TOP_BOTTOM_PADDING;

		drawCandles({
			chartData,
			ctx,
			canvasWidth: CANVAS_WIDTH,
			candleWidth: CANDLE_WIDTH,
			candleGap: CANDLE_GAP,
			tailWidth: TAIL_WIDTH,
			convertPriceToYPos,
		});
	}, [candleGraphChartRef]);

	return (
		<>
			<CandleBackground chartData={chartData} crossLine={crossLine} />
			<canvas
				className="chart-canvas chart-candle-graph"
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				ref={candleGraphChartRef}
			/>
			<CandleLegend chartData={chartData} crossLine={crossLine} />
		</>
	);
};

export default CandleGraph;
