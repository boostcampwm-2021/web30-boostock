import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import { OFFSET, NUM_OF_CANDLES, IProps, IDrawLegendProps, getTextColor, getBorderColor } from './common';

import './Chart.scss';

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 400;

const formatPeriodLegend = (timestamp: number) => {
	const date = new Date(timestamp);
	const yyyymmdd = date.toISOString().slice(0, 10);
	const hh = date.getHours().toString().padStart(2, '0');
	const mm = date.getMinutes().toString().padStart(2, '0');

	return `${yyyymmdd} ${hh}:${mm}`;
};

const drawPeriodLegend = ({ canvas, chartData, crossLine, theme }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const LEGEND_TOP = Math.floor(CANVAS_HEIGHT * 0.9);
	const textPadding = 5;
	const BOX_HEIGHT = 20;

	context.font = '11px dotum';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.strokeStyle = getBorderColor(theme);
	context.beginPath();
	context.moveTo(crossLine.posX + OFFSET, 0);
	context.lineTo(crossLine.posX + OFFSET, LEGEND_TOP);
	context.stroke();

	const ratio = crossLine.posX / CANVAS_WIDTH;
	const index = NUM_OF_CANDLES - Math.floor(NUM_OF_CANDLES * ratio) - 1;
	const date = !chartData[index]?.createdAt ? '' : formatPeriodLegend(chartData[index]?.createdAt);
	const textWidth = context.measureText(date).width + textPadding * 2;

	context.fillStyle = getBorderColor(theme);
	context.fillRect(crossLine.posX - textWidth / 2, LEGEND_TOP, textWidth, BOX_HEIGHT);
	context.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
	context.fillText(date, crossLine.posX, LEGEND_TOP + BOX_HEIGHT / 2);
};

const PeriodLegend = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const periodLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawPeriodLegend({
			canvas: periodLegendRef.current,
			chartData,
			crossLine,
			theme,
		});
	}, [crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-period-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={periodLegendRef} />
	);
};

export default PeriodLegend;
