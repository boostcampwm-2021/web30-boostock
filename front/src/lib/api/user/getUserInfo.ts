import { generateConfig, generateURL } from '@lib/api';
import { IUserDataResponse } from '@src/types';

export default async function getUserInfo(): Promise<IUserDataResponse | null> {
	const headers = generateConfig();
	const URL = generateURL('user');

	try {
		const res = await fetch(URL, headers);
		if (!res.ok) throw new Error();

		const { user } = await res.json();
		return user;
	} catch (error) {
		return null;
	}
}
