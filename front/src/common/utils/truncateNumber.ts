const ONE_THOUSAND = 1_000;
const ONE_MILLION = 1_000_000;
const ONE_BILLION = 1_000_000_000;

export function truncateNumber(data: number): number {
	if (data < ONE_MILLION) return data;
	if (data < ONE_BILLION) return Math.round(data / ONE_THOUSAND);
	return Math.round(data / ONE_MILLION);
}

export function truncateUnit(data: number, unit: string): string {
	if (data < ONE_MILLION) return unit;
	if (data < ONE_BILLION) return `천${unit}`;
	return `백만${unit}`;
}
