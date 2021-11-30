import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { IChartItem } from '@src/recoil/chart';
import userAtom, { IUser } from '@recoil/user/atom';
import { TTheme, getBorderColor, getLegendColor, getMaxValue, getMinValue, getText } from '../common';

interface IProps {
	chartData: IChartItem[];
	getYPosition: (maxValue: number, minValue: number, canvasHeight: number) => (value: number) => number;
}

interface IDrawVolumeBackgroundArgs {
	ctx: CanvasRenderingContext2D;
	minAmount: number;
	maxAmount: number;
	theme: TTheme;
	convertToYPosition: (value: number) => number;
}

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 72;
const NUM_OF_PARTITIONS = 4;
const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 101);

const drawVolumeLegend = ({ ctx, minAmount, maxAmount, theme, convertToYPosition }: IDrawVolumeBackgroundArgs): void => {
	ctx.font = '11px dotum';
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	ctx.strokeStyle = getLegendColor(theme);
	ctx.fillStyle = getBorderColor(theme);

	Array(NUM_OF_PARTITIONS)
		.fill(0)
		.map((_, i) => i)
		.forEach((index) => {
			const gapAmount = (maxAmount - minAmount) / (NUM_OF_PARTITIONS - 1);
			const amountValue = Math.floor(minAmount + gapAmount * index);
			const text = getText(amountValue, Number.isNaN);
			const yPos = convertToYPosition(amountValue);

			ctx.beginPath();
			ctx.moveTo(0, yPos);
			ctx.lineTo(LEGEND_LEFT, yPos);
			ctx.stroke();
			ctx.fillText(text, LEGEND_LEFT + 10, yPos + 5);
		});
};

const VolumeBackground = ({ chartData, getYPosition }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const volumeBackgroundRef = useRef<HTMLCanvasElement>(null);
	const maxAmount = getMaxValue(chartData, 'amount', 'amount');
	const minAmount = getMinValue(chartData, 'amount', 'amount');
	const convertToYPosition = getYPosition(maxAmount, minAmount, CANVAS_HEIGHT);

	useEffect(() => {
		if (!volumeBackgroundRef.current) return;

		const ctx = volumeBackgroundRef.current.getContext('2d');
		if (!ctx) return;

		drawVolumeLegend({
			ctx,
			minAmount,
			maxAmount,
			theme,
			convertToYPosition,
		});
	}, [volumeBackgroundRef, chartData, theme]);

	return (
		<canvas
			className="chart-canvas chart-volume-legend"
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			ref={volumeBackgroundRef}
		/>
	);
};

export default VolumeBackground;
