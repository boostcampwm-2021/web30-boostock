import React, { useEffect, useRef } from 'react';
import { OFFSET, NUM_OF_CANDLES, COLOR_BORDER, COLOR_LEGEND, IProps, IDrawLegendProps, initializeCanvasSize } from './common';

import './Chart.scss';

const PARTITION = 5;

const drawPeriodLegend = ({ canvas, crossLine }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const [CONTAINER_WIDTH, CONTAINER_HEIGHT] = initializeCanvasSize(canvas);
	const [CHART_TOP, LEGEND_TOP] = [Math.floor(CONTAINER_HEIGHT * 0.1), Math.floor(CONTAINER_HEIGHT * 0.9)];
	const [BOX_WIDTH, BOX_HEIGHT] = [50, 20];

	context.font = '11px dotum';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);

	context.strokeStyle = COLOR_BORDER;
	context.beginPath();
	context.moveTo(crossLine.posX + OFFSET, 0);
	context.lineTo(crossLine.posX + OFFSET, LEGEND_TOP);
	context.stroke();

	context.strokeStyle = COLOR_LEGEND;
	context.fillStyle = COLOR_BORDER;
	Array.from(Array(NUM_OF_CANDLES).keys()).forEach((index) => {
		if (index % PARTITION !== 0) return;

		const width = CONTAINER_WIDTH / NUM_OF_CANDLES;
		const value = index;
		const posX = Math.round(width * index - width / 2) + OFFSET;

		context.beginPath();
		context.moveTo(posX, CHART_TOP);
		context.lineTo(posX, LEGEND_TOP);
		context.stroke();

		context.fillText(String(value), posX, LEGEND_TOP + BOX_HEIGHT / 2);
	});

	const ratio = crossLine.posX / CONTAINER_WIDTH;
	const value = Math.round(NUM_OF_CANDLES * ratio);

	context.fillStyle = COLOR_BORDER;
	context.fillRect(crossLine.posX - BOX_WIDTH / 2, LEGEND_TOP, BOX_WIDTH, BOX_HEIGHT);
	context.fillStyle = '#fff';
	context.fillText(String(value), crossLine.posX, LEGEND_TOP + BOX_HEIGHT / 2);
};

const periodLegend = ({ chartData, crossLine }: IProps) => {
	const periodLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawPeriodLegend({
			canvas: periodLegendRef.current,
			chartData,
			crossLine,
		});
	}, [crossLine]);

	return <canvas className="chart-canvas chart-period-legend" ref={periodLegendRef} />;
};

export default periodLegend;
