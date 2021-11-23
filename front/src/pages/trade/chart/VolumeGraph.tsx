import React, { useEffect, useRef } from 'react';
import { NUM_OF_CANDLES, RATIO_MAX, IProps, IDrawProps, initializeCanvasSize, getPriceColor } from './common';

import './Chart.scss';

interface IDrawVolumeBarProps {
	context: CanvasRenderingContext2D;
	width: number;
	height: number;
	index: number;
	ratio: number;
	color: string;
}

const drawVolumeBar = ({ context, width, height, index, ratio, color }: IDrawVolumeBarProps): void => {
	const BAR_PAD = 10;
	const [x, y, w, h] = [width * index + BAR_PAD / 2, height - ratio * height, width - BAR_PAD / 2, ratio * height].map(
		(value) => Math.floor(value),
	);
	context.fillStyle = color;
	context.fillRect(x, y, w, h);
};

const drawVolumeGraph = ({ canvas, chartData }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const [CONTAINER_WIDTH, CONTAINER_HEIGHT] = initializeCanvasSize(canvas);
	const INDEX_START = NUM_OF_CANDLES - chartData.length - 1;
	const AMOUNT_MAX = chartData.reduce((prev, current) => {
		return Math.max(prev, current.amount * RATIO_MAX);
	}, Number.MIN_SAFE_INTEGER);

	context.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
	chartData.forEach((bar, index) => {
		drawVolumeBar({
			context,
			width: CONTAINER_WIDTH / NUM_OF_CANDLES,
			height: CONTAINER_HEIGHT,
			index: INDEX_START + index,
			ratio: bar.amount / AMOUNT_MAX,
			color: getPriceColor(bar.priceStart, bar.priceEnd),
		});
	});
};

const VolumeGraph = ({ chartData }: IProps) => {
	const volumeGraphRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawVolumeGraph({
			canvas: volumeGraphRef.current,
			chartData,
		});
	});

	return <canvas className="chart-canvas chart-volume-graph" ref={volumeGraphRef} />;
};

export default VolumeGraph;
