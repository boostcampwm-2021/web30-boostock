import { generateConfig, generateURL } from '@lib/api';

export default async function signOut(): Promise<boolean> {
	const headers = generateConfig({ method: 'POST' });
	const URL = generateURL('auth/signout');

	try {
		const res = await fetch(URL, headers);
		if (!res.ok) throw new Error();

		return true;
	} catch (error) {
		return false;
	}
}
