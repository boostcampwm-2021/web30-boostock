import React, { useEffect, useRef } from 'react';
import { OFFSET, NUM_OF_CANDLES, COLOR_BORDER, IProps, IDrawLegendProps } from './common';

import './Chart.scss';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 400;

const drawPeriodLegend = ({ canvas, crossLine }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const LEGEND_TOP = Math.floor(CANVAS_HEIGHT * 0.9);
	const [BOX_WIDTH, BOX_HEIGHT] = [50, 20];

	context.font = '11px dotum';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.strokeStyle = COLOR_BORDER;
	context.beginPath();
	context.moveTo(crossLine.posX + OFFSET, 0);
	context.lineTo(crossLine.posX + OFFSET, LEGEND_TOP);
	context.stroke();

	const ratio = crossLine.posX / CANVAS_WIDTH;
	const value = Math.round(NUM_OF_CANDLES * ratio);

	context.fillStyle = COLOR_BORDER;
	context.fillRect(crossLine.posX - BOX_WIDTH / 2, LEGEND_TOP, BOX_WIDTH, BOX_HEIGHT);
	context.fillStyle = '#fff';
	context.fillText(String(value), crossLine.posX, LEGEND_TOP + BOX_HEIGHT / 2);
};

const PeriodLegend = ({ chartData, crossLine }: IProps) => {
	const periodLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawPeriodLegend({
			canvas: periodLegendRef.current,
			chartData,
			crossLine,
		});
	}, [crossLine]);

	return (
		<canvas className="chart-canvas chart-period-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={periodLegendRef} />
	);
};

export default PeriodLegend;
