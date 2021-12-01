import { IChartItem } from '@src/types';
import { TChartType } from './common';

const ONE_MINUTE_IN_MILLISECONDS = 1000 * 60;
const ONE_HOUR_IN_MILLISECONDS = ONE_MINUTE_IN_MILLISECONDS * 60;
const TWO_HOURS_IN_MILLISECONDS = ONE_HOUR_IN_MILLISECONDS * 2;
const TWO_MONTHS_IN_MILLISECONDS = ONE_HOUR_IN_MILLISECONDS * 24 * 60;

const fetchChartData = async (code: string, type: TChartType, endDate: number = Date.now() - ONE_MINUTE_IN_MILLISECONDS) => {
	const config: RequestInit = {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	};

	const startDate = type === 1 ? endDate - TWO_HOURS_IN_MILLISECONDS : endDate - TWO_MONTHS_IN_MILLISECONDS;

	try {
		const res = await fetch(
			`${process.env.SERVER_URL}/api/stock/log?code=${code}&type=${type}&start=${startDate}&end=${endDate}`,
			config,
		);

		if (res.status !== 200) throw new Error();
		const { log }: { log: IChartItem[] } = await res.json();
		return log.reverse();
	} catch (error) {
		return [];
	}
};

export default fetchChartData;
