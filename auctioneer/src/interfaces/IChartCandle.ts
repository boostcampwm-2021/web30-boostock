export default interface IChartCandle {
	code: string;
	priceBefore: number;
	priceStart: number;
	priceEnd: number;
	priceHigh: number;
	priceLow: number;
	amount: number;
	volume: number;
	createdAt: Date;
}

const CHARTTYPE = {
	DAYS: 1440,
	MINUTES: 1,
};

export { CHARTTYPE };
