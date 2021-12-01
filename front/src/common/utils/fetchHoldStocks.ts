const fetchHoldStockList = async () => {
	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/hold`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});
		if (res.status !== 200) throw new Error();
		const { holdStocks } = await res.json();
		return holdStocks;
	} catch (error) {
		return [];
	}
};

export default fetchHoldStockList;
