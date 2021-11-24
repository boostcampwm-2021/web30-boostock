import React, { useEffect, useRef } from 'react';
import formatNumber from '@src/common/utils/formatNumber';
import {
	OFFSET,
	RATIO_MAX,
	RATIO_MIN,
	COLOR_BORDER,
	IProps,
	IDrawLegendProps,
	getPriceColor,
	getMaxValue,
	getMinValue,
} from './common';

import './Chart.scss';

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 252;

const drawCandleLegend = ({ canvas, chartData, crossLine }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 100);
	const maxPrice = getMaxValue(chartData, 'priceHigh', RATIO_MAX);
	const minPrice = getMinValue(chartData, 'priceLow', RATIO_MIN);

	context.font = '11px dotum';
	context.fillStyle = '#fff';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	const recentChart = chartData[0];
	if (recentChart && recentChart.priceEnd > 0) {
		const ratio = (recentChart.priceEnd - minPrice) / (maxPrice - minPrice);
		const posY = CANVAS_HEIGHT * (1 - ratio) + OFFSET;

		context.strokeStyle = getPriceColor(recentChart.priceStart, recentChart.priceEnd);
		context.beginPath();
		context.setLineDash([5, 5]);
		context.moveTo(0, posY);
		context.lineTo(LEGEND_LEFT, posY);
		context.stroke();

		context.fillStyle = context.strokeStyle;
		context.fillRect(LEGEND_LEFT, posY - 10, 100, 20);
		context.fillStyle = '#fff';
		context.fillText(formatNumber(recentChart.priceEnd), LEGEND_LEFT + 10, posY + 5);
	}

	if (crossLine.event?.target === canvas) {
		const ratio = (CANVAS_HEIGHT - crossLine.posY) / CANVAS_HEIGHT;
		const value = Math.floor(minPrice + (maxPrice - minPrice) * ratio);

		context.strokeStyle = COLOR_BORDER;
		context.beginPath();
		context.setLineDash([]);
		context.moveTo(0, crossLine.posY + OFFSET);
		context.lineTo(LEGEND_LEFT, crossLine.posY + OFFSET);
		context.stroke();

		context.fillStyle = COLOR_BORDER;
		context.fillRect(LEGEND_LEFT, crossLine.posY - 10, 100, 20);
		context.fillStyle = '#fff';
		context.fillText(formatNumber(value), LEGEND_LEFT + 10, crossLine.posY + 5);
	}
};

const CandleLegend = ({ chartData, crossLine }: IProps) => {
	const candleLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawCandleLegend({
			canvas: candleLegendRef.current,
			chartData,
			crossLine,
		});
	}, [chartData, crossLine]);

	return (
		<canvas className="chart-canvas chart-candle-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={candleLegendRef} />
	);
};

export default CandleLegend;
