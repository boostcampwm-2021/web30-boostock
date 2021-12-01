import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { IChartItem, Theme, IUser } from '@src/types';
import userAtom from '@recoil/user';
import formatNumber from '@common/utils/formatNumber';
import {
	IGraphComponentProps,
	ICrossLine,
	PRICE_CANVAS_TOP_BOT_PADDING as CANVAS_PADDING,
	MAKE_CLEAR_OFFSET,
	getPriceColor,
	getMaxValue,
	getMinValue,
	getTextColor,
	getBorderColor,
	getText,
} from '../common';

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 252;
const LEGEND_WIDTH = 100;
const LEGEND_HEIGHT = 20;
const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 100);

interface IDrawCandleLegendArgs {
	ctx: CanvasRenderingContext2D;
	chartData: IChartItem[];
	theme: Theme;
	convertToYPosition: (value: number) => number;
}

interface IDrawHoverCandleLegendArgs {
	ctx: CanvasRenderingContext2D;
	crossLine: ICrossLine;
	maxPrice: number;
	minPrice: number;
	theme: Theme;
	convertToYPosition: (value: number) => number;
}

const drawCandleLegend = ({ ctx, chartData, theme, convertToYPosition }: IDrawCandleLegendArgs): void => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.font = '11px Lato';
	ctx.fillStyle = getTextColor(theme);

	const recentChart = chartData[0];
	if (recentChart && recentChart.priceEnd > 0) {
		const { priceStart, priceEnd } = recentChart;
		const yPos = convertToYPosition(priceEnd);

		ctx.strokeStyle = getPriceColor(priceStart, priceEnd, theme);
		ctx.beginPath();
		ctx.setLineDash([4, 4]);
		ctx.moveTo(0, yPos + MAKE_CLEAR_OFFSET);
		ctx.lineTo(LEGEND_LEFT, yPos + MAKE_CLEAR_OFFSET);
		ctx.stroke();

		ctx.fillStyle = ctx.strokeStyle;
		ctx.fillRect(LEGEND_LEFT, yPos - LEGEND_HEIGHT / 2, LEGEND_WIDTH, LEGEND_HEIGHT);
		ctx.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
		ctx.fillText(formatNumber(recentChart.priceEnd), LEGEND_LEFT + LEGEND_WIDTH / 10, yPos + LEGEND_HEIGHT / 4);
	}
};

const drawHoverCandleLegend = ({ crossLine, ctx, minPrice, maxPrice, theme, convertToYPosition }: IDrawHoverCandleLegendArgs) => {
	if (!crossLine.event || crossLine.event.target !== ctx.canvas) return;

	const ratio = (crossLine.posY - CANVAS_PADDING) / (CANVAS_HEIGHT - CANVAS_PADDING * 2);
	const priceValue = Math.floor(minPrice + (maxPrice - minPrice) * (1 - ratio));
	const yPos = convertToYPosition(priceValue);
	const text = getText(priceValue, Number.isNaN);

	ctx.strokeStyle = getBorderColor(theme);
	ctx.beginPath();
	ctx.setLineDash([6, 6]);
	ctx.moveTo(0, yPos + MAKE_CLEAR_OFFSET);
	ctx.lineTo(LEGEND_LEFT, yPos + MAKE_CLEAR_OFFSET);
	ctx.stroke();

	ctx.fillStyle = getBorderColor(theme);
	ctx.fillRect(LEGEND_LEFT, yPos - LEGEND_HEIGHT / 2, LEGEND_WIDTH, LEGEND_HEIGHT);
	ctx.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
	ctx.fillText(text, LEGEND_LEFT + LEGEND_WIDTH / 10, yPos + LEGEND_HEIGHT / 4);
};

const CandleLegend = ({ chartData, crossLine, getYPosition }: IGraphComponentProps) => {
	const candleLegendRef = useRef<HTMLCanvasElement>(null);
	const { theme } = useRecoilValue<IUser>(userAtom);
	const maxPrice = getMaxValue(chartData, 'amount', 'priceHigh');
	const minPrice = getMinValue(chartData, 'amount', 'priceLow');
	const convertToYPosition = getYPosition(maxPrice, minPrice, CANVAS_HEIGHT);

	useEffect(() => {
		if (!candleLegendRef.current) return;

		const ctx = candleLegendRef.current.getContext('2d');
		if (!ctx) return;

		drawCandleLegend({
			ctx,
			chartData,
			theme,
			convertToYPosition,
		});

		drawHoverCandleLegend({
			ctx,
			crossLine,
			maxPrice,
			minPrice,
			theme,
			convertToYPosition,
		});
	}, [candleLegendRef, crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-candle-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={candleLegendRef} />
	);
};

export default CandleLegend;
