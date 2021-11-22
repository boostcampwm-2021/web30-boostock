import { IChartItem } from '@recoil/chart';

export const OFFSET = 0.5;
export const NUM_OF_CANDLES = 60;
export const RATIO_MIN = 0.9;
export const RATIO_MAX = 1.1;

export const COLOR_BORDER = '#444';
export const COLOR_LEGEND = '#ccc';

export interface IProps {
	chartData: IChartItem[];
}

export interface IDrawProps {
	canvas: HTMLCanvasElement | null;
	chartData: IChartItem[];
}

export function initializeCanvasSize(canvas: HTMLCanvasElement) {
	const CONTAINER_WIDTH = Number(window.getComputedStyle(canvas).getPropertyValue('width').replace('px', ''));
	const CONTAINER_HEIGHT = Number(window.getComputedStyle(canvas).getPropertyValue('height').replace('px', ''));
	canvas.setAttribute('width', String(CONTAINER_WIDTH));
	canvas.setAttribute('height', String(CONTAINER_HEIGHT));

	return [CONTAINER_WIDTH, CONTAINER_HEIGHT];
}

export function getPriceColor(priceStart: number, priceEnd: number): string {
	const priceDiff = priceEnd - priceStart;

	if (priceDiff > 0) return '#d60000';
	if (priceDiff < 0) return '#0051c7';
	return 'black';
}
