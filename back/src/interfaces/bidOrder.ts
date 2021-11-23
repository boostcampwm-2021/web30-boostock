import { ORDERTYPE } from '@models/Order';

export interface IBidOrder {
	type: ORDERTYPE.BID;
	price: number;
	amount: number;
}
