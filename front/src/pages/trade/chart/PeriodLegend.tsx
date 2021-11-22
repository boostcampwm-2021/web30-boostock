import React, { useEffect, useRef } from 'react';
import { IChartItem } from '@recoil/chart';

import './Chart.scss';

interface IDrawPeriodLegendProps {
	canvas: HTMLCanvasElement | null;
	chart: IChartItem[];
	numOfCandles: number;
}

interface IProps {
	chartData: IChartItem[];
	numOfCandles: number;
}

const drawPeriodLegend = ({ canvas, chart, numOfCandles }: IDrawPeriodLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;
	console.log(window.getComputedStyle(canvas).getPropertyValue('width').replace('px', ''));
	const CONTAINER_WIDTH = Math.floor(window.getComputedStyle(canvas).getPropertyValue('width').replace('px', ''));
	const CONTAINER_HEIGHT = Math.floor(window.getComputedStyle(canvas).getPropertyValue('height').replace('px', ''));
	console.log(CONTAINER_WIDTH);
	canvas.setAttribute('width', String(CONTAINER_WIDTH));
	canvas.setAttribute('height', String(CONTAINER_HEIGHT));

	const PERIOD_TOP = Math.floor(CONTAINER_HEIGHT * 0.9);
	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
	context.beginPath();
	context.moveTo(0, PERIOD_TOP);
	context.lineTo(CONTAINER_WIDTH, PERIOD_TOP);
	context.stroke();

	// TEMP
	for (let i = 0; i < 1; i++) {
		const x = Math.floor((CONTAINER_WIDTH * i) / numOfCandles);
		context.beginPath();
		context.lineWidth = 0.5;
		context.moveTo(1, 0);
		context.lineTo(1, 10);
		context.stroke();
	}
};

const periodLegend = ({ chartData, numOfCandles }: IProps) => {
	const periodLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawPeriodLegend({
			canvas: periodLegendRef.current,
			chartData,
			numOfCandles,
		});
	});

	return <canvas className="chart-canvas chart-period-legend" ref={periodLegendRef} />;
};

export default periodLegend;
