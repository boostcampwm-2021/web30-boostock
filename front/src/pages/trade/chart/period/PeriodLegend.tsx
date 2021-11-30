import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@recoil/user';
import { IChartItem } from '@recoil/chart';
import { ICrossLine, TTheme, getTextColor, MAKE_CLEAR_OFFSET, getBorderColor, formatCandleDate } from '../common';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 400;

interface IProps {
	chartData: IChartItem[];
	crossLine: ICrossLine;
}

interface IDrawPeriodLegendArgs {
	ctx: CanvasRenderingContext2D;
	chartData: IChartItem[];
	crossLine: ICrossLine;
	theme: TTheme;
	numOfCandles: number;
}

const formatPeriodLegend = (timestamp: number) => {
	const date = new Date(timestamp);
	const [mm, dd, yyyy] = date.toLocaleString('en').slice(0, 10).split('/');

	return `${yyyy}-${mm}-${dd} ${formatCandleDate(timestamp)}`;
};

const drawPeriodLegend = ({ ctx, chartData, crossLine, theme, numOfCandles }: IDrawPeriodLegendArgs): void => {
	const VOLUME_TOP = Math.floor(CANVAS_HEIGHT * 0.7);
	const LEGEND_TOP = Math.floor(CANVAS_HEIGHT * 0.9);
	const textPadding = 5;
	const BOX_HEIGHT = 20;

	ctx.font = '11px Lato';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	ctx.strokeStyle = getBorderColor(theme);
	ctx.beginPath();
	ctx.moveTo(crossLine.posX + MAKE_CLEAR_OFFSET, 0);
	ctx.lineTo(crossLine.posX + MAKE_CLEAR_OFFSET, LEGEND_TOP);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, VOLUME_TOP - MAKE_CLEAR_OFFSET);
	ctx.lineTo(CANVAS_WIDTH, VOLUME_TOP - MAKE_CLEAR_OFFSET);
	ctx.stroke();

	const ratio = crossLine.posX / CANVAS_WIDTH;
	const index = numOfCandles - Math.floor(numOfCandles * ratio) - 1;
	const date = !chartData[index]?.createdAt ? '' : formatPeriodLegend(chartData[index]?.createdAt);
	const textWidth = ctx.measureText(date).width + textPadding * 2;

	ctx.fillStyle = getBorderColor(theme);
	ctx.fillRect(crossLine.posX - textWidth / 2, LEGEND_TOP, textWidth, BOX_HEIGHT);
	ctx.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
	ctx.fillText(date, crossLine.posX, LEGEND_TOP + BOX_HEIGHT / 2);
};

const PeriodLegend = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const periodLegendRef = useRef<HTMLCanvasElement>(null);
	const numOfCandles = chartData.length;

	useEffect(() => {
		if (!periodLegendRef.current) return;

		const ctx = periodLegendRef.current.getContext('2d');
		if (!ctx) return;

		drawPeriodLegend({
			ctx,
			chartData,
			crossLine,
			numOfCandles,
			theme,
		});
	}, [periodLegendRef, crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-period-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={periodLegendRef} />
	);
};

export default PeriodLegend;
