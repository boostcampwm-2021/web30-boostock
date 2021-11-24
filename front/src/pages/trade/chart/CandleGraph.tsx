import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import { IChartItem } from '@src/recoil/chart/atom';

import { ICrossLine, getMaxValue, getMinValue, RATIO_MAX, RATIO_MIN, CANDLE_GAP, NUM_OF_CANDLES, getPriceColor } from './common';
import CandleBackground from './CandleBackground';
import CandleLegend from './CandleLegend';
import './Chart.scss';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 280;

interface IProps {
	chartData: IChartItem[];
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

const drawCandles = ({
	chartData,
	ctx,
	canvasWidth,
	candleWidth,
	candleGap,
	tailWidth,
	theme,
	convertPriceToYPos,
}: IDrawData) => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	chartData.forEach(({ priceHigh, priceLow, priceStart, priceEnd }, idx) => {
		const isPositive = isPositiveCandle(priceStart, priceEnd);
		const candleBarX = canvasWidth - (candleWidth + candleGap) * (idx + 1);
		const candleBarY = convertPriceToYPos(isPositive ? priceEnd : priceStart);
		const candleHeight = Math.abs(convertPriceToYPos(priceStart) - convertPriceToYPos(priceEnd));

		const tailX = candleBarX + (candleWidth - tailWidth) / 2;
		const tailY = convertPriceToYPos(priceHigh);
		const tailHeight = convertPriceToYPos(priceLow) - tailY;

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

const CandleGraph = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const candleGraphChartRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!candleGraphChartRef.current) return;

		const ctx = candleGraphChartRef.current.getContext('2d');
		if (!ctx) return;

		const CANDLE_WIDTH = (CANVAS_WIDTH - (NUM_OF_CANDLES + 1) * CANDLE_GAP) / NUM_OF_CANDLES;
		const TAIL_WIDTH = 1;

		const maxPrice = getMaxValue(chartData, 'priceHigh', RATIO_MAX);
		const minPrice = getMinValue(chartData, 'priceLow', RATIO_MIN);

		const convertPriceToYPos = (curPrice: number) => ((maxPrice - curPrice) / (maxPrice - minPrice)) * CANVAS_HEIGHT;

		drawCandles({
			chartData,
			ctx,
			canvasWidth: CANVAS_WIDTH,
			candleWidth: CANDLE_WIDTH,
			candleGap: CANDLE_GAP,
			tailWidth: TAIL_WIDTH,
			theme,
			convertPriceToYPos,
		});
	}, [chartData, candleGraphChartRef, theme]);

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
