import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { IChartItem, Theme, IUser } from '@src/types';
import userAtom from '@recoil/user';
import {
	ICrossLine,
	VOLUME_CANVAS_TOP_BOT_PADDING as CANVAS_PADDING,
	MAKE_CLEAR_OFFSET,
	getTextColor,
	getBorderColor,
	getMaxValue,
	getMinValue,
	getText,
} from '../common';

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 72;
const LEGEND_WIDTH = 100;
const LEGEND_HEIGHT = 20;
const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 100);

export interface IProps {
	chartData: IChartItem[];
	crossLine: ICrossLine;
}

interface IDrawHoverVolumeLegendArgs {
	ctx: CanvasRenderingContext2D;
	crossLine: ICrossLine;
	minAmount: number;
	maxAmount: number;
	theme: Theme;
}

const drawHoverVolumeLegend = ({ crossLine, ctx, minAmount, maxAmount, theme }: IDrawHoverVolumeLegendArgs) => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	if (!crossLine.event || crossLine.event.target !== ctx.canvas) return;
	if (!Number.isFinite(minAmount)) return;

	ctx.font = '11px Lato';
	const ratio = (crossLine.posY - CANVAS_PADDING) / (CANVAS_HEIGHT - CANVAS_PADDING * 2);
	const volumeValue = Math.floor(minAmount + (maxAmount - minAmount) * (1 - ratio));
	const text = getText(volumeValue, (arg: number) => arg <= 0);

	ctx.strokeStyle = getBorderColor(theme);
	ctx.beginPath();
	ctx.setLineDash([6, 6]);
	ctx.moveTo(0, crossLine.posY + MAKE_CLEAR_OFFSET);
	ctx.lineTo(LEGEND_LEFT, crossLine.posY + MAKE_CLEAR_OFFSET);
	ctx.stroke();

	ctx.fillStyle = getBorderColor(theme);
	ctx.fillRect(LEGEND_LEFT, crossLine.posY - LEGEND_HEIGHT / 2, LEGEND_WIDTH, LEGEND_HEIGHT);
	ctx.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
	ctx.fillText(text, LEGEND_LEFT + LEGEND_WIDTH / 10, crossLine.posY + LEGEND_HEIGHT / 4);
};

const VolumeLegend = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const volumeLegendRef = useRef<HTMLCanvasElement>(null);
	const maxAmount = getMaxValue(chartData, 'amount', 'amount');
	const minAmount = getMinValue(chartData, 'amount', 'amount');

	useEffect(() => {
		if (!volumeLegendRef.current) return;

		const ctx = volumeLegendRef.current.getContext('2d');
		if (!ctx) return;

		drawHoverVolumeLegend({
			ctx,
			crossLine,
			maxAmount,
			minAmount,
			theme,
		});
	}, [volumeLegendRef, crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-volume-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={volumeLegendRef} />
	);
};

export default VolumeLegend;
