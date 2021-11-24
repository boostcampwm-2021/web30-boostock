import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/index';
import { NUM_OF_CANDLES, RATIO_MAX, CANDLE_GAP, IProps, IDrawProps, getPriceColor, getMaxValue } from './common';

import VolumeBackground from './VolumeBackground';
import VolumeLegend from './VolumeLegend';
import './Chart.scss';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 72;
const CANDLE_WIDTH = (CANVAS_WIDTH - (NUM_OF_CANDLES + 1) * CANDLE_GAP) / NUM_OF_CANDLES;

interface IDrawVolumeBarProps {
	context: CanvasRenderingContext2D;
	index: number;
	ratio: number;
	color: string;
}

const drawVolumeBar = ({ context, index, ratio, color }: IDrawVolumeBarProps): void => {
	const x = CANVAS_WIDTH - (CANDLE_WIDTH + CANDLE_GAP) * (index + 1);
	const y = CANVAS_HEIGHT - ratio * CANVAS_HEIGHT;
	const w = CANDLE_WIDTH;
	const h = ratio * CANVAS_HEIGHT;
	context.fillStyle = color;
	context.fillRect(x, y, w, h);
};

const drawVolumeGraph = ({ canvas, chartData, theme }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const maxAmount = getMaxValue(chartData, 'amount', RATIO_MAX);

	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	chartData.forEach((bar, index) => {
		drawVolumeBar({
			context,
			index,
			ratio: bar.amount / maxAmount,
			color: getPriceColor(bar.priceStart, bar.priceEnd, theme),
		});
	});
};

const VolumeGraph = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const volumeGraphRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawVolumeGraph({
			canvas: volumeGraphRef.current,
			chartData,
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
