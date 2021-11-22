import CommonError from './CommonError';

export enum OrderErrorMessage {
	INVALID_ORDER = 'Invalid Order',
	INVALID_DATA = 'Invalid Data',
	NOT_ENOUGH_STOCK = 'Not Enough Stock',
	NOT_ENOUGH_BALANCE = 'Not Enough Balance',
}

export default class OrderError extends CommonError {
	constructor(message: OrderErrorMessage | string) {
		super(message);
		this.name = 'Order Error';
		this.status = 400;
	}
}
