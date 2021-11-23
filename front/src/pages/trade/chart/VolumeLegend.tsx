import React, { useEffect, useRef } from 'react';
import { OFFSET, RATIO_MAX, COLOR_BORDER, COLOR_LEGEND, IProps, IDrawLegendProps, initializeCanvasSize } from './common';

import './Chart.scss';

const PARTITION = 4;

const drawVolumeLegend = ({ canvas, chartData, crossLine }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const [CONTAINER_WIDTH, CONTAINER_HEIGHT] = initializeCanvasSize(canvas);
	const LEGEND_LEFT = Math.floor(CONTAINER_WIDTH - 100);
	const AMOUNT_MAX = chartData.reduce((prev, current) => {
		return Math.max(prev, current.amount * RATIO_MAX);
	}, Number.MIN_SAFE_INTEGER);

	context.font = '11px dotum';
	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);

	context.strokeStyle = COLOR_BORDER;
	context.beginPath();
	context.moveTo(LEGEND_LEFT + OFFSET, 0);
	context.lineTo(LEGEND_LEFT + OFFSET, CONTAINER_HEIGHT);
	context.lineTo(0, CONTAINER_HEIGHT - OFFSET);
	context.stroke();

	context.strokeStyle = COLOR_LEGEND;
	context.fillStyle = COLOR_BORDER;
	Array.from(Array(PARTITION).keys()).forEach((index) => {
		const ratio = (PARTITION - index) / (PARTITION + 1);
		const value = AMOUNT_MAX * ratio;
		const posY = CONTAINER_HEIGHT * (1 - ratio) + OFFSET;

		context.beginPath();
		context.moveTo(0, posY);
		context.lineTo(LEGEND_LEFT, posY);
		context.stroke();

		context.fillText(String(value), LEGEND_LEFT + 10, posY + 5);
	});

	if (crossLine.event?.target === canvas) {
		const ratio = (CONTAINER_HEIGHT - crossLine.posY) / CONTAINER_HEIGHT;
		const value = Math.floor(AMOUNT_MAX * ratio);

		context.strokeStyle = COLOR_BORDER;
		context.beginPath();
		context.moveTo(0, crossLine.posY + OFFSET);
		context.lineTo(LEGEND_LEFT, crossLine.posY + OFFSET);
		context.stroke();

		context.fillStyle = COLOR_BORDER;
		context.fillRect(LEGEND_LEFT, crossLine.posY - 10, 100, 20);
		context.fillStyle = '#fff';
		context.fillText(String(value), LEGEND_LEFT + 10, crossLine.posY + 5);
	}
};

const VolumeLegend = ({ chartData, crossLine }: IProps) => {
	const volumeLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawVolumeLegend({
			canvas: volumeLegendRef.current,
			chartData,
			crossLine,
		});
	}, [crossLine]);

	return <canvas className="chart-canvas chart-volume-legend" ref={volumeLegendRef} />;
};

export default VolumeLegend;
