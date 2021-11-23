import React, { useEffect, useRef } from 'react';
import { OFFSET, RATIO_MAX, COLOR_BORDER, IProps, IDrawLegendProps, initializeCanvasSize } from './common';

import './Chart.scss';

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
