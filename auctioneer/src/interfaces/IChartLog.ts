export default interface IChartLog {
	code: string;
	type: number;
	priceBefore: number;
	priceStart: number;
	priceEnd: number;
	priceHigh: number;
	priceLow: number;
	amount: number;
	volume: number;
}

const CHARTTYPE = {
	DAYS: 1440,
	MINUTES: 1,
};

export { CHARTTYPE };
