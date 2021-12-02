import { generateConfig, generateURL } from '@lib/api';

interface IWithdrawData {
	bank: string;
	bankAccount: string;
	changeValue: number;
}

export default async function withdraw(postData: IWithdrawData): Promise<boolean> {
	const optionalConfig: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
	};
	const headers = generateConfig(optionalConfig, postData);
	const URL = generateURL('user/balance/withdraw');

	try {
		const res = await fetch(URL, headers);
		if (!res.ok) throw new Error();

		return true;
	} catch (error) {
		return false;
	}
}
