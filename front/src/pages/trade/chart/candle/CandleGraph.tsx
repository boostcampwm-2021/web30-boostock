import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@recoil/user';
import { IChartItem } from '@recoil/chart';

import { IGraphComponentProps, TTheme, CANDLE_GAP, getMaxValue, getMinValue, getPriceColor } from '../common';
import CandleBackground from './CandleBackground';
import CandleLegend from './CandleLegend';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 280;

interface IDrawData {
	chartData: Array<IChartItem>;
	ctx: CanvasRenderingContext2D;
	canvasWidth: number;
	candleWidth: number;
	candleGap: number;
	tailWidth: number;
	theme: TTheme;
	convertToYPosition: (curPrice: number) => number;
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

const drawCandles = ({
	chartData,
	ctx,
	canvasWidth,
	candleWidth,
	candleGap,
	tailWidth,
	theme,
	convertToYPosition,
}: IDrawData) => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	chartData.forEach(({ priceHigh, priceLow, priceStart, priceEnd }, idx) => {
		const isPositive = isPositiveCandle(priceStart, priceEnd);
		const candleBarX = Math.floor(canvasWidth - (candleWidth + candleGap) * (idx + 1));
		const candleBarY = Math.floor(convertToYPosition(isPositive ? priceEnd : priceStart));
		const candleHeight = Math.floor(Math.abs(convertToYPosition(priceStart) - convertToYPosition(priceEnd)));

		const tailX = Math.floor(candleBarX + (candleWidth - tailWidth) / 2);
		const tailY = Math.floor(convertToYPosition(priceHigh));
		const tailHeight = Math.floor(convertToYPosition(priceLow) - tailY);

		if (isDodgeCandle(priceStart, priceEnd)) {
			ctx.fillStyle = getPriceColor(priceStart, priceEnd, theme);
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

		const candleColor = getPriceColor(priceStart, priceEnd, theme);
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

const CandleGraph = ({ chartData, crossLine, getYPosition }: IGraphComponentProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const candleGraphChartRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!candleGraphChartRef.current) return;

		const ctx = candleGraphChartRef.current.getContext('2d');
		if (!ctx) return;

		const NUM_OF_CANDLES = chartData.length;
		const candleWidth = (CANVAS_WIDTH - (NUM_OF_CANDLES + 1) * CANDLE_GAP) / NUM_OF_CANDLES;
		const TAIL_WIDTH = 1;

		const maxPrice = getMaxValue(chartData, 'amount', 'priceHigh');
		const minPrice = getMinValue(chartData, 'amount', 'priceLow');
		const convertToYPosition = getYPosition(maxPrice, minPrice, CANVAS_HEIGHT);

		drawCandles({
			chartData,
			ctx,
			canvasWidth: CANVAS_WIDTH,
			candleWidth,
			candleGap: CANDLE_GAP,
			tailWidth: TAIL_WIDTH,
			theme,
			convertToYPosition,
		});
	}, [chartData, candleGraphChartRef, theme]);

	return (
		<>
			<CandleBackground chartData={chartData} getYPosition={getYPosition} />
			<canvas
				className="chart-canvas chart-candle-graph"
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				ref={candleGraphChartRef}
			/>
			<CandleLegend chartData={chartData} crossLine={crossLine} getYPosition={getYPosition} />
		</>
	);
};

export default CandleGraph;
