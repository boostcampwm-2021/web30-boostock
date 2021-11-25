import { IChartItem } from '@recoil/chart';

export const OFFSET = 0.5;
export const NUM_OF_CANDLES = 60;
export const RATIO_MIN = 0.9;
export const RATIO_MAX = 1.1;
export const CANDLE_GAP = 5;

type Ttheme = 'light' | 'dark';

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
	theme: Ttheme;
}

export interface IDrawLegendProps extends IDrawProps {
	crossLine: ICrossLine;
	chartData: IChartItem[];
	theme: Ttheme;
}

export const getMaxValue = (chartData: IChartItem[], property: keyof IChartItem, upperBuffer = 1): number =>
	Math.max(...chartData.map((data) => data[property])) * upperBuffer;

export const getMinValue = (chartData: IChartItem[], property: keyof IChartItem, lowerBuffer = 1): number =>
	Math.min(...chartData.filter((data) => data[property] > 0).map((data) => data[property])) * lowerBuffer;

export const formatCandleDate = (timestamp: number) => {
	const date = new Date(timestamp);
	const hh = date.getHours().toString().padStart(2, '0');
	const mm = date.getMinutes().toString().padStart(2, '0');

	return `${hh}:${mm}`;
};

export const getTextColor = (theme: Ttheme) => {
	return theme === 'light' ? '#000' : '#f1f1f1';
};

export const getBorderColor = (theme: Ttheme) => {
	return theme === 'light' ? '#444' : '#f1f1f1';
};

export const getLegendColor = (theme: Ttheme) => {
	return theme === 'light' ? '#ccc' : '#404040';
};

const getPositiveCandleColor = (theme: Ttheme) => {
	return theme === 'light' ? '#d60000' : '#e34652';
};

const getNegativeCandleColor = (theme: Ttheme) => {
	return theme === 'light' ? '#0051c7' : '#4386dc';
};

const getDodgeCandleColor = (theme: Ttheme) => {
	return theme === 'light' ? '#000' : '#697081';
};

export function getPriceColor(priceStart: number, priceEnd: number, theme: Ttheme): string {
	const priceDiff = priceEnd - priceStart;

	if (priceDiff > 0) return getPositiveCandleColor(theme);
	if (priceDiff < 0) return getNegativeCandleColor(theme);
	return getDodgeCandleColor(theme);
}
