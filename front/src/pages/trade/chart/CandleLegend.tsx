import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import formatNumber from '@src/common/utils/formatNumber';
import {
	OFFSET,
	RATIO_MAX,
	RATIO_MIN,
	IProps,
	IDrawLegendProps,
	getPriceColor,
	getMaxValue,
	getMinValue,
	getTextColor,
	getBorderColor,
	getText,
} from './common';

import './Chart.scss';

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 252;

const drawCandleLegend = ({ canvas, chartData, crossLine, theme }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 100);
	const maxPrice = getMaxValue(chartData, 'amount', 'priceHigh', RATIO_MAX);
	const minPrice = getMinValue(chartData, 'amount', 'priceLow', RATIO_MIN);

	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	context.font = '11px dotum';
	context.fillStyle = getTextColor(theme);

	const recentChart = chartData[0];
	if (recentChart && recentChart.priceEnd > 0) {
		const ratio = (recentChart.priceEnd - minPrice) / (maxPrice - minPrice);
		const posY = Math.floor(CANVAS_HEIGHT * (1 - ratio)) + OFFSET;

		const { priceStart, priceEnd } = recentChart;
		context.strokeStyle = getPriceColor(priceStart, priceEnd, theme);
		context.beginPath();
		context.setLineDash([5, 5]);
		context.moveTo(0, posY);
		context.lineTo(LEGEND_LEFT, posY);
		context.stroke();

		context.fillStyle = context.strokeStyle;
		context.fillRect(LEGEND_LEFT, posY - 10, 100, 20);
		context.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
		context.fillText(formatNumber(recentChart.priceEnd), LEGEND_LEFT + 10, posY + 5);
	}

	if (crossLine.event?.target === canvas) {
		const ratio = (CANVAS_HEIGHT - crossLine.posY) / CANVAS_HEIGHT;
		const priceValue = Math.floor(minPrice + (maxPrice - minPrice) * ratio);
		const text = getText(priceValue, Number.isNaN);

		context.strokeStyle = getBorderColor(theme);
		context.beginPath();
		context.setLineDash([]);
		context.moveTo(0, crossLine.posY + OFFSET);
		context.lineTo(LEGEND_LEFT, crossLine.posY + OFFSET);
		context.stroke();

		context.fillStyle = getBorderColor(theme);
		context.fillRect(LEGEND_LEFT, crossLine.posY - 10, 100, 20);
		context.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
		context.fillText(text, LEGEND_LEFT + 10, crossLine.posY + 5);
	}
};

const CandleLegend = ({ chartData, crossLine }: IProps) => {
	const candleLegendRef = useRef<HTMLCanvasElement>(null);
	const { theme } = useRecoilValue<IUser>(userAtom);

	useEffect(() => {
		drawCandleLegend({
			canvas: candleLegendRef.current,
			chartData,
			crossLine,
			theme,
		});
	}, [crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-candle-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={candleLegendRef} />
	);
};

export default CandleLegend;
