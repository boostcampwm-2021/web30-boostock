const ONE_THOUSAND = 1_000;
const ONE_MILLION = 1_000_000;
const ONE_BILLION = 1_000_000_000;

export function truncateNumber(data: string | number): string | number {
	const convertedData = Number(data);

	if (convertedData < ONE_MILLION) return data;
	if (convertedData < ONE_BILLION) return Math.round(convertedData / ONE_THOUSAND);
	return Math.round(convertedData / ONE_MILLION);
}

export function truncateUnit(data: string | number, unit: string): string | number {
	const convertedData = Number(data);

	if (convertedData < ONE_MILLION) return unit;
	if (convertedData < ONE_BILLION) return `천${unit}`;
	return `백만${unit}`;
}
