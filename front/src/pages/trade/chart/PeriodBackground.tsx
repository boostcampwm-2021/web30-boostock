import React, { useEffect, useRef } from 'react';
import { OFFSET, NUM_OF_CANDLES, COLOR_BORDER, COLOR_LEGEND, IProps, IDrawProps } from './common';

import './Chart.scss';

const PARTITION = 5;
const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 400;
const BOX_HEIGHT = 20;

const drawPeriodBackground = ({ canvas }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;
	const [CHART_TOP, LEGEND_TOP] = [Math.floor(CANVAS_HEIGHT * 0.1), Math.floor(CANVAS_HEIGHT * 0.9)];

	context.font = '11px dotum';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.strokeStyle = COLOR_LEGEND;
	context.fillStyle = COLOR_BORDER;
	Array.from(Array(NUM_OF_CANDLES).keys()).forEach((index) => {
		if (index % PARTITION !== 0) return;

		const width = CANVAS_WIDTH / NUM_OF_CANDLES;
		const value = index;
		const posX = Math.round(width * index - width / 2) + OFFSET;

		context.beginPath();
		context.moveTo(posX, CHART_TOP);
		context.lineTo(posX, LEGEND_TOP);
		context.stroke();

		context.fillText(String(value), posX, LEGEND_TOP + BOX_HEIGHT / 2);
	});
};

const PeriodBackground = ({ chartData, crossLine }: IProps) => {
	const periodLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawPeriodBackground({
			canvas: periodLegendRef.current,
			chartData,
		});
	}, [crossLine]);

	return (
		<canvas className="chart-canvas chart-period-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={periodLegendRef} />
	);
};

export default PeriodBackground;
