import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/index';
import { IChartItem } from '@src/recoil/chart';
import { CANDLE_GAP, IProps, getPriceColor, getMaxValue, getMinValue, TTheme } from '../common';
import VolumeBackground from './VolumeBackground';
import VolumeLegend from './VolumeLegend';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 72;

interface IDrawVolumeBarProps {
	ctx: CanvasRenderingContext2D;
	index: number;
	y: number;
	h: number;
	color: string;
	candleWidth: number;
}

interface IDrawVolumeGraphArgs {
	ctx: CanvasRenderingContext2D;
	chartData: IChartItem[];
	candleWidth: number;
	theme: TTheme;
	convertToYPosition: (curAmount: number) => number;
}

const drawVolumeBar = ({ ctx, index, y, h, color, candleWidth }: IDrawVolumeBarProps): void => {
	const x = Math.floor(CANVAS_WIDTH - (candleWidth + CANDLE_GAP) * (index + 1));
	const w = Math.floor(candleWidth);
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
};

const drawVolumeGraph = ({ ctx, chartData, theme, candleWidth, convertToYPosition }: IDrawVolumeGraphArgs): void => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	const numOfCandles = chartData.length;
	chartData.forEach(({ amount, priceStart, priceEnd }, index) => {
		const color =
			index + 1 >= numOfCandles
				? getPriceColor(priceStart, priceEnd, theme)
				: getPriceColor(chartData[index + 1].amount, amount, theme);

		drawVolumeBar({
			ctx,
			index,
			y: convertToYPosition(amount),
			h: CANVAS_HEIGHT - convertToYPosition(amount),
			color,
			candleWidth,
		});
	});
};

const VolumeGraph = ({ chartData, crossLine, getYPosition }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const volumeGraphRef = useRef<HTMLCanvasElement>(null);
	const numOfCandles = chartData.length;
	const candleWidth = (CANVAS_WIDTH - (numOfCandles + 1) * CANDLE_GAP) / numOfCandles;
	const maxAmount = getMaxValue(chartData, 'amount', 'amount');
	const minAmount = getMinValue(chartData, 'amount', 'amount');
	const convertToYPosition = getYPosition(maxAmount, minAmount, CANVAS_HEIGHT);

	useEffect(() => {
		if (!volumeGraphRef.current) return;

		const ctx = volumeGraphRef.current.getContext('2d');
		if (!ctx) return;

		drawVolumeGraph({
			ctx,
			chartData,
			candleWidth,
			theme,
			convertToYPosition,
		});
	}, [volumeGraphRef, chartData, theme]);

	return (
		<>
			<VolumeBackground chartData={chartData} getYPosition={getYPosition} />
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
