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
	createdAt: number;
}

const CHARTTYPE = {
	DAYS: 1440,
	MINUTES: 1,
} as const;

// eslint-disable-next-line @typescript-eslint/naming-convention
type CHARTTYPE_VALUE = typeof CHARTTYPE[keyof typeof CHARTTYPE];

export { CHARTTYPE, CHARTTYPE_VALUE };
