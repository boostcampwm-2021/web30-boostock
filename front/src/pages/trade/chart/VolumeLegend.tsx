import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import formatNumber from '@src/common/utils/formatNumber';
import { OFFSET, RATIO_MAX, IProps, IDrawLegendProps, getTextColor, getBorderColor } from './common';

import './Chart.scss';

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 72;

const drawVolumeLegend = ({ canvas, chartData, crossLine, theme }: IDrawLegendProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 100);
	const AMOUNT_MAX = chartData.reduce((prev, current) => {
		return Math.max(prev, current.amount * RATIO_MAX);
	}, Number.MIN_SAFE_INTEGER);

	context.font = '11px dotum';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	if (crossLine.event?.target === canvas) {
		const ratio = (CANVAS_HEIGHT - crossLine.posY) / CANVAS_HEIGHT;
		const value = Math.floor(AMOUNT_MAX * ratio);

		context.strokeStyle = getBorderColor(theme);
		context.beginPath();
		context.moveTo(0, crossLine.posY + OFFSET);
		context.lineTo(LEGEND_LEFT, crossLine.posY + OFFSET);
		context.stroke();

		context.fillStyle = getBorderColor(theme);
		context.fillRect(LEGEND_LEFT, crossLine.posY - 10, 100, 20);
		context.fillStyle = getTextColor(theme === 'light' ? 'dark' : 'light');
		context.fillText(formatNumber(value), LEGEND_LEFT + 10, crossLine.posY + 5);
	}
};

const VolumeLegend = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const volumeLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawVolumeLegend({
			canvas: volumeLegendRef.current,
			chartData,
			crossLine,
			theme,
		});
	}, [crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-volume-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={volumeLegendRef} />
	);
};

export default VolumeLegend;
