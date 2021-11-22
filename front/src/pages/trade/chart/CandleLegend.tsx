import React, { useEffect, useRef } from 'react';
import { OFFSET, RATIO_MAX, COLOR_BORDER, COLOR_LEGEND, IProps, IDrawProps, initializeCanvasSize } from './common';

import './Chart.scss';

const drawCandleLegend = ({ canvas, chartData }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const [CONTAINER_WIDTH, CONTAINER_HEIGHT] = initializeCanvasSize(canvas);
	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);

	const LEGEND_LEFT = Math.floor(CONTAINER_WIDTH - 100);

	context.strokeStyle = COLOR_LEGEND;
	Array.from(Array(4).keys()).forEach((index) => {
		const height = CONTAINER_HEIGHT / 5;
		const y = Math.round(height * (index + 1)) + OFFSET;

		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(LEGEND_LEFT, y);
		context.stroke();

		context.font = '11px dotum';
		context.fillStyle = COLOR_BORDER;
		context.fillText('1,234', LEGEND_LEFT + 10, y + 5);
	});

	context.strokeStyle = COLOR_BORDER;
	context.beginPath();
	context.moveTo(LEGEND_LEFT + OFFSET, 0);
	context.lineTo(LEGEND_LEFT + OFFSET, CONTAINER_HEIGHT);
	context.lineTo(0, CONTAINER_HEIGHT - OFFSET);
	context.stroke();
};

const CandleLegend = ({ chartData }: IProps) => {
	const candleLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawCandleLegend({
			canvas: candleLegendRef.current,
			chartData,
		});
	});

	return <canvas className="chart-canvas chart-candle-legend" ref={candleLegendRef} />;
};

export default CandleLegend;
