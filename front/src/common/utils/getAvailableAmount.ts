export interface IHoldStock {
	amount: number;
	average: number;
	code: string;
	nameEnglish: string;
	nameKorean: string;
}

export const getUserBidAvailable = async (isLoggedIn: boolean): Promise<number> => {
	if (!isLoggedIn) return 0;
	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/balance?start=0&end=0`, { credentials: 'include' });
		if (!res.ok) throw new Error();
		const { balance }: { balance: number } = await res.json();
		return balance;
	} catch (error) {
		return 0;
	}
};

export const getUserAskAvailable = async (stockCode: string, isLoggedIn: boolean): Promise<number> => {
	if (!isLoggedIn) return 0;

	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/hold`, { credentials: 'include' });
		if (!res.ok) throw new Error();
		const { holdStocks }: { holdStocks: IHoldStock[] } = await res.json();
		const [holdStock] = holdStocks.filter(({ code }) => code === stockCode);

		if (!holdStock) return 0;
		return holdStock.amount;
	} catch (error) {
		return 0;
	}
};
