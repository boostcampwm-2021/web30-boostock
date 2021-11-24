import { IChartItem } from '@recoil/chart';

export const OFFSET = 0.5;
export const NUM_OF_CANDLES = 60;
export const RATIO_MIN = 0.9;
export const RATIO_MAX = 1.1;
export const CANDLE_GAP = 5;

export const COLOR_BORDER = '#444';
export const COLOR_LEGEND = '#ccc';

export interface ICrossLine {
	event: MouseEvent | null;
	posX: number;
	posY: number;
}

export interface IProps {
	chartData: IChartItem[];
	crossLine: ICrossLine;
}

export interface IDrawProps {
	canvas: HTMLCanvasElement | null;
	chartData: IChartItem[];
}

export interface IDrawLegendProps extends IDrawProps {
	crossLine: ICrossLine;
}

export function getPriceColor(priceStart: number, priceEnd: number): string {
	const priceDiff = priceEnd - priceStart;

	if (priceDiff > 0) return '#d60000';
	if (priceDiff < 0) return '#0051c7';
	return 'black';
}

export const drawCrossLine = (context: CanvasRenderingContext2D, width: number, height: number, crossLine: ICrossLine): void => {
	context.strokeStyle = COLOR_BORDER;
	context.beginPath();
	context.moveTo(0, crossLine.posY + OFFSET);
	context.lineTo(width, crossLine.posY + OFFSET);
	context.stroke();

	context.beginPath();
	context.moveTo(crossLine.posX + OFFSET, 0);
	context.lineTo(crossLine.posX + OFFSET, height);
	context.stroke();
};

export const getMaxValue = (chartData: IChartItem[], property: keyof IChartItem, upperBuffer = 1): number =>
	Math.max(...chartData.map((data) => data[property])) * upperBuffer;

export const getMinValue = (chartData: IChartItem[], property: keyof IChartItem, lowerBuffer = 1): number =>
	Math.min(...chartData.map((data) => data[property])) * lowerBuffer;
