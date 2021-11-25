import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom, { IUser } from '@src/recoil/user/atom';
import { OFFSET, RATIO_MAX, IProps, IDrawProps, getBorderColor, getLegendColor, getMaxValue, getText } from './common';

import './Chart.scss';

const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 72;

const PARTITION = 4;

const drawVolumeLegend = ({ canvas, chartData, theme }: IDrawProps): void => {
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	const LEGEND_LEFT = Math.floor(CANVAS_WIDTH - 101);
	const maxAmount = getMaxValue(chartData, 'amount', 'amount', RATIO_MAX);

	context.font = '11px dotum';
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.strokeStyle = getLegendColor(theme);
	context.fillStyle = getBorderColor(theme);
	Array.from(Array(PARTITION).keys()).forEach((index) => {
		const ratio = (PARTITION - index) / (PARTITION + 1);
		const posY = Math.floor(CANVAS_HEIGHT * (1 - ratio)) + OFFSET;
		const volumeValue = Math.floor(maxAmount * ratio);
		const text = getText(volumeValue, (arg: number) => !Number.isFinite(arg));

		context.beginPath();
		context.moveTo(0, posY);
		context.lineTo(LEGEND_LEFT, posY);
		context.stroke();

		context.fillText(text, LEGEND_LEFT + 10, posY + 5);
	});
};

const VolumeBackground = ({ chartData, crossLine }: IProps) => {
	const { theme } = useRecoilValue<IUser>(userAtom);
	const volumeLegendRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		drawVolumeLegend({
			canvas: volumeLegendRef.current,
			chartData,
			theme,
		});
	}, [crossLine, chartData, theme]);

	return (
		<canvas className="chart-canvas chart-volume-legend" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={volumeLegendRef} />
	);
};

export default VolumeBackground;
