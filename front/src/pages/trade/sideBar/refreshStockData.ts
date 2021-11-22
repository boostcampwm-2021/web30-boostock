export const getFavoriteStocks = async () => {
	const res = await fetch(`${process.env.SERVER_URL}/api/user/favorite`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
	if (res.ok) {
		const { favorite } = await res.json();
		return favorite;
	}
	return [];
};
export const getHoldStocks = async () => {
	const res = await fetch(`${process.env.SERVER_URL}/api/user/hold`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
	if (res.ok) {
		const { holdStocks } = await res.json();
		return holdStocks.map((stock: { code: string }) => stock.code);
	}
	return [];
};
