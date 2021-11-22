import React, { useEffect, useRef } from 'react';
import { IChartItem } from '@recoil/chart';

import './Chart.scss';

interface IDrawVolumeBarProps {
	context: CanvasRenderingContext2D;
	width: number;
	height: number;
	index: number;
	ratio: number;
	color: string;
}

interface IDrawVolumeGraphProps {
	canvas: HTMLCanvasElement | null;
	chart: IChartItem[];
	numOfCandles: number;
}

interface IProps {
	chartData: IChartItem[];
	numOfCandles: number;
}

const getColor = (priceStart: number, priceEnd: number): string => {
	const priceDiff = priceEnd - priceStart;

	if (priceDiff > 0) return 'red';
	else if (priceDiff < 0) return 'blue';
	return 'black';
};

const drawVolumeBar = ({ context, width, height, index, ratio, color }: IDrawVolumeBarProps): void => {
	const BAR_PAD = 10;
	const [x, y, w, h] = [width * index + BAR_PAD / 2, height - ratio * height, width - BAR_PAD / 2, ratio * height].map((value) => Math.floor(value));
	context.fillStyle = color;
	context.fillRect(x, y, w, h);
};

const drawVolumeGraph = ({ canvas, chart, numOfCandles }: IDrawVolumeGraphProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const CONTAINER_WIDTH = window.getComputedStyle(canvas).getPropertyValue('width').replace('px', '');
	const CONTAINER_HEIGHT = window.getComputedStyle(canvas).getPropertyValue('height').replace('px', '');
	canvas.setAttribute('width', String(CONTAINER_WIDTH));
	canvas.setAttribute('height', String(CONTAINER_HEIGHT));

	const TOP_PAD = 0.1;
	const [AMOUNT_MIN, AMOUNT_MAX] = chart.reduce(
		(prev, current) => {
			return [Math.min(prev[0], current.amount), Math.max(prev[1], current.amount * (1 + TOP_PAD))];
		},
		[Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
	);

	const INDEX_START = numOfCandles - chart.length - 1;
	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
	chart.forEach((bar, index) => {
		const width = CONTAINER_WIDTH / numOfCandles;
		const ratio = (bar.amount - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN);
		const color = getColor(bar.priceStart, bar.priceEnd);
		drawVolumeBar({
			context,
			width,
			height: CONTAINER_HEIGHT,
			index: INDEX_START + index,
			ratio,
			color,
		});
	});
};

const VolumeGraph = ({ chartRef, chartData, numOfCandles }: IProps) => {
	const volumeGraphRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawVolumeGraph({
			canvas: volumeGraphRef.current,
			chart: chartData,
			numOfCandles,
		});
	});

	return <canvas className="chart-canvas chart-volume-graph" ref={volumeGraphRef} />;
};

export default VolumeGraph;
