import React, { useEffect, useRef } from 'react';
import { CANDLE_GAP, NUM_OF_CANDLES, COLOR_BORDER, COLOR_LEGEND, IProps, IDrawProps, formatCandleDate } from './common';

import './Chart.scss';

const PARTITION = 5;
const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 400;
const CANDLE_WIDTH = (CANVAS_WIDTH - (NUM_OF_CANDLES + 1) * CANDLE_GAP) / NUM_OF_CANDLES;
const BOX_HEIGHT = 20;

const drawPeriodBackground = ({ canvas, chartData }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;
	const [CHART_TOP, LEGEND_TOP] = [Math.floor(CANVAS_HEIGHT * 0.1), Math.floor(CANVAS_HEIGHT * 0.9)];

	context.font = '11px dotum';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.strokeStyle = COLOR_LEGEND;
	context.fillStyle = COLOR_BORDER;
	chartData.forEach(({ timestamp }, index) => {
		if (index % PARTITION !== 0) return;

		const posX = CANVAS_WIDTH - (CANDLE_WIDTH + CANDLE_GAP) * (index + 1) + CANDLE_WIDTH / 2;

		context.beginPath();
		context.moveTo(posX, CHART_TOP);
		context.lineTo(posX, LEGEND_TOP);
		context.stroke();

		context.fillText(formatCandleDate(timestamp), posX, LEGEND_TOP + BOX_HEIGHT / 2);
	});
};

const PeriodBackground = ({ chartData, crossLine }: IProps) => {
	const periodLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawPeriodBackground({
			canvas: periodLegendRef.current,
			chartData,
		});
	}, [crossLine, chartData]);

	return (
		<canvas className="chart-canvas chart-period-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={periodLegendRef} />
	);
};

export default PeriodBackground;
