import { generateConfig, generateURL } from '@lib/api';
import { IHistory } from '@src/types';

interface IBalanceResponseData {
	balance: number;
	log: IHistory[];
}

export default async function getBalance(beforeTime: number, currentTime: number): Promise<IBalanceResponseData | null> {
	const headers = generateConfig();
	const URL = generateURL('user/balance', `start=${beforeTime}&end=${currentTime}`);

	try {
		const res = await fetch(URL, headers);
		if (!res.ok) throw new Error();

		const resData = await res.json();
		return resData;
	} catch (error) {
		return null;
	}
}
