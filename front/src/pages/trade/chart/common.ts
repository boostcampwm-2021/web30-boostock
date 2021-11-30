import { IChartItem } from '@recoil/chart';
import formatNumber from '@src/common/utils/formatNumber';

export const MAKE_CLEAR_OFFSET = 0.5;
export const NUM_OF_CANDLES = 60;
export const RATIO_MIN = 1.0;
export const RATIO_MAX = 1.0;
export const CANDLE_GAP = 5;
export const CANVAS_TOP_BOTTOM_PADDING = 14;

export type TTheme = 'light' | 'dark';
export type TChartType = 1 | 1440;

export interface ICrossLine {
	event: MouseEvent | null;
	posX: number;
	posY: number;
}

export interface IProps {
	chartData: IChartItem[];
	crossLine: ICrossLine;
	getYPosition: (maxValue: number, minValue: number, canvasHeight: number) => (value: number) => number;
}

export interface IDrawProps {
	canvas: HTMLCanvasElement | null;
	chartData: IChartItem[];
	theme: TTheme;
	candleWidth?: number;
}

export interface IDrawLegendProps extends IDrawProps {
	crossLine: ICrossLine;
	maxPrice: number;
	minPrice: number;
	numOfCandles?: number;
	convertToYPosition: (value: number) => number;
}

export const getText = (value: number, predicate: (arg: number) => boolean) => {
	if (predicate(value)) return '';
	return formatNumber(value);
};

export const getMaxValue = (
	chartData: IChartItem[],
	validProperty: keyof IChartItem,
	filterProperty: keyof IChartItem,
	upperBuffer = 1,
): number => Math.max(...chartData.filter((data) => data[validProperty] > 0).map((data) => data[filterProperty])) * upperBuffer;

export const getMinValue = (
	chartData: IChartItem[],
	validProperty: keyof IChartItem,
	filterProperty: keyof IChartItem,
	lowerBuffer = 1,
): number => Math.min(...chartData.filter((data) => data[validProperty] > 0).map((data) => data[filterProperty])) * lowerBuffer;

export const formatCandleDate = (timestamp: number) => {
	const date = new Date(timestamp);
	const hh = date.getHours().toString().padStart(2, '0');
	const mm = date.getMinutes().toString().padStart(2, '0');

	return `${hh}:${mm}`;
};

export const getTextColor = (theme: TTheme) => {
	return theme === 'light' ? '#000' : '#f1f1f1';
};

export const getBorderColor = (theme: TTheme) => {
	return theme === 'light' ? '#444' : '#f1f1f1';
};

export const getLegendColor = (theme: TTheme) => {
	return theme === 'light' ? '#ccc' : '#404040';
};

const getPositiveCandleColor = (theme: TTheme) => {
	return theme === 'light' ? '#d60000' : '#e34652';
};

const getNegativeCandleColor = (theme: TTheme) => {
	return theme === 'light' ? '#0051c7' : '#4386dc';
};

const getDodgeCandleColor = (theme: TTheme) => {
	return theme === 'light' ? '#000' : '#697081';
};

export function getPriceColor(priceStart: number, priceEnd: number, theme: TTheme): string {
	const priceDiff = priceEnd - priceStart;

	if (priceDiff > 0) return getPositiveCandleColor(theme);
	if (priceDiff < 0) return getNegativeCandleColor(theme);
	return getDodgeCandleColor(theme);
}
