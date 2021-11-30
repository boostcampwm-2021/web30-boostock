import { ORDERTYPE } from '@models/Order';

export interface IOrder {
	type: number;
	price: number;
	volume: string;
}
