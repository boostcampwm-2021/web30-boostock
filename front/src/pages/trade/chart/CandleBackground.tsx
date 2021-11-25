import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import formatNumber from '@src/common/utils/formatNumber';
import {
	OFFSET,
	IProps,
	RATIO_MAX,
	RATIO_MIN,
	IDrawProps,
	getMaxValue,
	getMinValue,
	getTextColor,
	getBorderColor,
	getLegendColor,
} from './common';

import './Chart.scss';

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 252;
const PARTITION = 4;

const drawCandleLegend = ({ canvas, chartData, theme }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 100);
	const maxPrice = getMaxValue(chartData, 'priceHigh', RATIO_MAX);
	const minPrice = getMinValue(chartData, 'priceLow', RATIO_MIN);

	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.font = '11px dotum';
	context.strokeStyle = getBorderColor(theme);
	context.beginPath();
	context.moveTo(LEGEND_LEFT + OFFSET, 0);
	context.lineTo(LEGEND_LEFT + OFFSET, CANVAS_HEIGHT);
	context.lineTo(0, CANVAS_HEIGHT - OFFSET);
	context.stroke();

	context.strokeStyle = getLegendColor(theme);
	context.fillStyle = getTextColor(theme);
	Array.from(Array(PARTITION).keys()).forEach((index) => {
		const ratio = (PARTITION - index) / (PARTITION + 1);
		const value = Math.floor(minPrice + (maxPrice - minPrice) * ratio);
		const posY = Math.floor(CANVAS_HEIGHT * (1 - ratio)) + OFFSET;

		context.beginPath();
		context.moveTo(0, posY);
		context.lineTo(LEGEND_LEFT, posY);
		context.stroke();

		context.fillText(formatNumber(value), LEGEND_LEFT + 10, posY + 5);
	});
};

const CandleLegend = ({ chartData }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const candleLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawCandleLegend({
			canvas: candleLegendRef.current,
			chartData,
			theme,
		});
	}, [chartData, candleLegendRef, theme]);

	return (
		<canvas className="chart-canvas chart-candle-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={candleLegendRef} />
	);
};

export default CandleLegend;
