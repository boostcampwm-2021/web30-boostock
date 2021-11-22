interface IHoldStock {
	amount: number;
	average: number;
	code: string;
	nameEnglish: string;
	nameKorean: string;
}

interface IHoldStocks {
	holdStocks: IHoldStock[];
}

const config: RequestInit = {
	method: 'GET',
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
	},
};

export default async function fetchHoldStocks(isLoggedIn: boolean): Promise<string[]> {
	if (!isLoggedIn) return [];

	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/hold`, config);
		if (res.status !== 200) throw new Error();
		const { holdStocks: userHoldStocks }: IHoldStocks = await res.json();
		const userHoldStockCodes = userHoldStocks.map(({ code }) => code);
		return userHoldStockCodes;
	} catch (error) {
		return [];
	}
}
