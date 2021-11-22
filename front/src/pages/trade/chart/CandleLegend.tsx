import React, { useEffect, useRef } from 'react';
import { IChartItem } from '@recoil/chart';

import './Chart.scss';

interface IDrawCandleLegendProps {
	canvas: HTMLCanvasElement | null;
	chart: IChartItem[];
	numOfCandles: number;
}

interface IProps {
	chartData: IChartItem[];
	numOfCandles: number;
}

const drawCandleLegend = ({ canvas, chart, numOfCandles }: IDrawCandleLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const CONTAINER_WIDTH = window.getComputedStyle(canvas).getPropertyValue('width').replace('px', '');
	const CONTAINER_HEIGHT = window.getComputedStyle(canvas).getPropertyValue('height').replace('px', '');
	canvas.setAttribute('width', String(CONTAINER_WIDTH));
	canvas.setAttribute('height', String(CONTAINER_HEIGHT));

	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(0, CONTAINER_HEIGHT);
	context.stroke();
};

const CandleLegend = ({ chartData, numOfCandles }: IProps) => {
	const candleLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawCandleLegend({
			canvas: candleLegendRef.current,
			chartData,
			numOfCandles,
		});
	});

	return <canvas className="chart-canvas chart-candle-legend" ref={candleLegendRef} />;
};

export default CandleLegend;
