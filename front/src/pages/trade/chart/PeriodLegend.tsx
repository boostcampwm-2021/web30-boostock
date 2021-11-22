import React, { useEffect, useRef } from 'react';
import { OFFSET, NUM_OF_CANDLES, COLOR_BORDER, COLOR_LEGEND, IProps, IDrawProps, initializeCanvasSize } from './common';

import './Chart.scss';

const drawPeriodLegend = ({ canvas }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const [CONTAINER_WIDTH, CONTAINER_HEIGHT] = initializeCanvasSize(canvas);
	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);

	const CHART_TOP = Math.floor(CONTAINER_HEIGHT * 0.1);
	const LEGEND_TOP = Math.floor(CONTAINER_HEIGHT * 0.9);

	context.strokeStyle = COLOR_LEGEND;
	Array.from(Array(NUM_OF_CANDLES).keys()).forEach((index) => {
		if (index % 5 !== 0) return;

		const width = CONTAINER_WIDTH / NUM_OF_CANDLES;
		const x = Math.round(width * index - width / 2) + OFFSET;

		context.beginPath();
		context.moveTo(x, CHART_TOP);
		context.lineTo(x, LEGEND_TOP);
		context.stroke();

		context.font = '11px dotum';
		context.textAlign = 'center';
		context.fillStyle = COLOR_BORDER;
		context.fillText('1,234', x, LEGEND_TOP + 20);
	});
};

const periodLegend = ({ chartData }: IProps) => {
	const periodLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawPeriodLegend({
			canvas: periodLegendRef.current,
			chartData,
		});
	});

	return <canvas className="chart-canvas chart-period-legend" ref={periodLegendRef} />;
};

export default periodLegend;
