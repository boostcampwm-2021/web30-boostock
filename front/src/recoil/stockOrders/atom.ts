import { atom } from 'recoil';

enum IOrderType {
	SELL = 1,
	BUY = 2,
}

export interface IAskOrderItem {
	type: IOrderType.SELL;
	price: number;
	amount: number;
}

export interface IBidOrderItem {
	type: IOrderType.BUY;
	price: number;
	amount: number;
}
const askOrdersAtom = atom<IAskOrderItem[]>({
	key: 'askOrdersAtom',
	default: [],
});

const bidOrdersAtom = atom<IBidOrderItem[]>({
	key: 'bidOrdersAtom',
	default: [],
});

export { askOrdersAtom, bidOrdersAtom };
