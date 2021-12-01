import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { IChartItem } from '@src/types';
import userAtom, { IUser } from '@recoil/user';
import { TTheme, getMaxValue, getMinValue, getTextColor, getLegendColor, getText } from '../common';

interface IProps {
	chartData: IChartItem[];
	getYPosition: (maxValue: number, minValue: number, canvasHeight: number) => (value: number) => number;
}

interface IDrawCandleBackgroundArgs {
	ctx: CanvasRenderingContext2D;
	minPrice: number;
	maxPrice: number;
	theme: TTheme;
	convertToYPosition: (value: number) => number;
}

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 252;
const NUM_OF_PARTITIONS = 6;
const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 101);

const drawCandleBackground = ({ ctx, maxPrice, minPrice, theme, convertToYPosition }: IDrawCandleBackgroundArgs): void => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.font = '11px Lato';
	ctx.strokeStyle = getLegendColor(theme);
	ctx.fillStyle = getTextColor(theme);

	Array(NUM_OF_PARTITIONS)
		.fill(0)
		.map((_, i) => i)
		.forEach((index) => {
			const gapPrice = (maxPrice - minPrice) / (NUM_OF_PARTITIONS - 1);
			const priceValue = minPrice + gapPrice * index;
			const text = getText(priceValue, Number.isNaN);
			const yPos = convertToYPosition(priceValue);

			ctx.beginPath();
			ctx.moveTo(0, yPos);
			ctx.lineTo(LEGEND_LEFT, yPos);
			ctx.stroke();
			ctx.fillText(text, LEGEND_LEFT + 10, yPos + 5);
		});
};

const CandleBackground = ({ chartData, getYPosition }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const candleBackgroundRef = useRef<HTMLCanvasElement>(null);
	const maxPrice = getMaxValue(chartData, 'amount', 'priceHigh');
	const minPrice = getMinValue(chartData, 'amount', 'priceLow');
	const convertToYPosition = getYPosition(maxPrice, minPrice, CANVAS_HEIGHT);

	useEffect(() => {
		if (!candleBackgroundRef.current) return;
		const ctx = candleBackgroundRef.current.getContext('2d');
		if (!ctx) return;

		drawCandleBackground({
			ctx,
			maxPrice,
			minPrice,
			theme,
			convertToYPosition,
		});
	}, [candleBackgroundRef, chartData, theme]);

	return (
		<canvas
			className="chart-canvas chart-candle-legend"
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			ref={candleBackgroundRef}
		/>
	);
};

export default CandleBackground;
