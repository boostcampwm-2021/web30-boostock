import React, { useEffect, useRef } from 'react';
import {
	OFFSET,
	RATIO_MIN,
	RATIO_MAX,
	COLOR_BORDER,
	COLOR_LEGEND,
	IProps,
	IDrawLegendProps,
	initializeCanvasSize,
	getPriceColor,
	getMaxPriceAndMinPrice,
} from './common';

import './Chart.scss';

const drawCandleLegend = ({ canvas, chartData, crossLine }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const [CONTAINER_WIDTH, CONTAINER_HEIGHT] = initializeCanvasSize(canvas);
	const LEGEND_LEFT = Math.floor(CONTAINER_WIDTH - 100);
	const { maxPrice, minPrice } = getMaxPriceAndMinPrice(chartData, 1.1, 0.9);

	context.font = '11px dotum';
	context.fillStyle = '#fff';
	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);

	const recentChart = chartData[chartData.length - 1];
	if (recentChart) {
		const ratio = (recentChart.priceEnd - minPrice) / (maxPrice - minPrice);
		const posY = CONTAINER_HEIGHT * (1 - ratio) + OFFSET;

		context.strokeStyle = getPriceColor(chartData[chartData.length - 1].priceStart, chartData[chartData.length - 1].priceEnd);
		context.beginPath();
		context.setLineDash([5, 5]);
		context.moveTo(0, posY + OFFSET);
		context.lineTo(LEGEND_LEFT, posY + OFFSET);
		context.stroke();

		context.fillStyle = context.strokeStyle;
		context.fillRect(LEGEND_LEFT, posY - 10, 100, 20);
		context.fillStyle = '#fff';
		context.fillText(String(recentChart.priceEnd), LEGEND_LEFT + 10, posY + 5);
	}

	if (crossLine.event?.target === canvas) {
		const ratio = (CONTAINER_HEIGHT - crossLine.posY) / CONTAINER_HEIGHT;
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
		context.fillText(String(value), LEGEND_LEFT + 10, crossLine.posY + 5);
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
	}, [crossLine]);

	return <canvas className="chart-canvas chart-candle-legend" ref={candleLegendRef} />;
};

export default CandleLegend;
