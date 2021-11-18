import { askAvailableAtom, bidAvailableAtom } from './atom';

export { askAvailableAtom, bidAvailableAtom };

interface IHoldStock {
	amount: number;
	average: number;
	code: string;
	nameEnglish: string;
	nameKorean: string;
}

export async function getUserAskAvailable(stockCode: string): Promise<number> {
	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/hold`, { credentials: 'include' });
		if (res.status !== 200) throw new Error();
		const { holdStocks }: { holdStocks: IHoldStock[] } = await res.json();
		const [holdStock] = holdStocks.filter(({ code }) => code === stockCode);

		if (!holdStock) return 0;

		return holdStock.amount;
	} catch (error) {
		return 0;
	}
}

export async function getUserBidAvailable(): Promise<number> {
	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/balance?start=0&end=0`, { credentials: 'include' });
		if (res.status !== 200) throw new Error();
		const { balance }: { balance: number } = await res.json();

		return balance;
	} catch (error) {
		return 0;
	}
}
