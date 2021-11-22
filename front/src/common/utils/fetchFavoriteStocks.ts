interface IFavoriteStocks {
	favorite: string[];
}

const config: RequestInit = {
	method: 'GET',
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
	},
};

export default async function fetchFavoriteStocks(isLoggedIn: boolean): Promise<string[]> {
	if (!isLoggedIn) return [];

	try {
		const res = await fetch(`${process.env.SERVER_URL}/api/user/favorite`, config);
		if (res.status !== 200) throw new Error();
		const { favorite: userFavoriteStocks }: IFavoriteStocks = await res.json();
		return userFavoriteStocks;
	} catch (error) {
		return [];
	}
}
