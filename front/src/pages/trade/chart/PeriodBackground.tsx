import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import { CANDLE_GAP, IProps, IDrawProps, formatCandleDate, getTextColor, getLegendColor } from './common';

import './Chart.scss';

const PARTITION = 5;
const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 400;
const BOX_HEIGHT = 20;

const drawPeriodBackground = ({ canvas, chartData, candleWidth, theme }: IDrawProps): void => {
	if (!candleWidth) return;
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const [CHART_TOP, LEGEND_TOP] = [Math.floor(CANVAS_WIDTH * 0), Math.floor(CANVAS_HEIGHT * 0.9)];

	context.font = '11px dotum';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.strokeStyle = getLegendColor(theme);
	context.fillStyle = getTextColor(theme);
	chartData.forEach(({ createdAt }, index) => {
		if (index % PARTITION !== 0) return;

		const posX = Math.floor(CANVAS_WIDTH - (candleWidth + CANDLE_GAP) * (index + 1) + candleWidth / 2);

		context.beginPath();
		context.moveTo(posX, CHART_TOP);
		context.lineTo(posX, LEGEND_TOP);
		context.stroke();

		context.fillText(formatCandleDate(createdAt), posX, Math.floor(LEGEND_TOP + BOX_HEIGHT / 2));
	});
};

const PeriodBackground = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const periodLegendRef = useRef<HTMLCanvasElement>(null);
	const numOfCandles = chartData.length;
	const candleWidth = (CANVAS_WIDTH - (numOfCandles + 1) * CANDLE_GAP) / numOfCandles;

	useEffect(() => {
		drawPeriodBackground({
			canvas: periodLegendRef.current,
			chartData,
			candleWidth,
			theme,
		});
	}, [crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-period-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={periodLegendRef} />
	);
};

export default PeriodBackground;
