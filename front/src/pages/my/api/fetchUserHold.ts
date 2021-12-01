import { IHoldStockItem } from '@src/types';

export default async function fetchUserHold(): Promise<Array<IHoldStockItem>> {
	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/hold`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});

		if (res.status >= 400) throw new Error();

		const { holdStocks } = await res.json();
		return holdStocks;
	} catch (error) {
		return [];
	}
}
