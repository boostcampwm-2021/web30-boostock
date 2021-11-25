import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/index';
import { RATIO_MAX, CANDLE_GAP, IProps, IDrawProps, getPriceColor, getMaxValue } from './common';

import VolumeBackground from './VolumeBackground';
import VolumeLegend from './VolumeLegend';
import './Chart.scss';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 72;

interface IDrawVolumeBarProps {
	context: CanvasRenderingContext2D;
	index: number;
	ratio: number;
	color: string;
	candleWidth: number;
}

const drawVolumeBar = ({ context, index, ratio, color, candleWidth }: IDrawVolumeBarProps): void => {
	const x = Math.floor(CANVAS_WIDTH - (candleWidth + CANDLE_GAP) * (index + 1));
	const y = Math.floor(CANVAS_HEIGHT - ratio * CANVAS_HEIGHT);
	const w = Math.floor(candleWidth);
	const h = Math.floor(ratio * CANVAS_HEIGHT);
	context.fillStyle = color;
	context.fillRect(x, y, w, h);
};

const drawVolumeGraph = ({ canvas, chartData, theme, candleWidth }: IDrawProps): void => {
	if (!candleWidth) return;
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const maxAmount = getMaxValue(chartData, 'amount', 'amount', RATIO_MAX);

	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	chartData.forEach((bar, index) => {
		drawVolumeBar({
			context,
			index,
			ratio: bar.amount / maxAmount,
			color: getPriceColor(bar.priceStart, bar.priceEnd, theme),
			candleWidth,
		});
	});
};

const VolumeGraph = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const volumeGraphRef = useRef<HTMLCanvasElement>(null);
	const numOfCandles = chartData.length;
	const candleWidth = (CANVAS_WIDTH - (numOfCandles + 1) * CANDLE_GAP) / numOfCandles;

	useEffect(() => {
		drawVolumeGraph({
			canvas: volumeGraphRef.current,
			chartData,
			candleWidth,
			theme,
		});
	}, [chartData, volumeGraphRef, theme]);

	return (
		<>
			<VolumeBackground chartData={chartData} crossLine={crossLine} />
			<canvas
				className="chart-canvas chart-volume-graph"
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				ref={volumeGraphRef}
			/>
			<VolumeLegend chartData={chartData} crossLine={crossLine} />
		</>
	);
};

export default VolumeGraph;
