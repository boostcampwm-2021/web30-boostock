import { ORDERTYPE } from '@models/Order';

export interface IAskOrder {
	type: ORDERTYPE.ASK;
	price: number;
	volume: string;
}
