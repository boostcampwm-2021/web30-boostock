import CommonError from './CommonError';

export enum OrderErrorMessage {
	INVALID_TYPE = 'Invalid Order Type',
	INVALID_OPTION = 'Invalid Order Option',
	INVALID_AMOUNT = 'Invalid Amount',
	INVALID_PRICE = 'Invalid Price',
	LACK_OF_BALANCE = 'Lack of Balance',
	NOT_EXIST_ORDER = 'Not Exist Order',
	NOT_PENDING_ORDER = 'Not Pending Order',
}

export default class OrderError extends CommonError {
	constructor(message: OrderErrorMessage | string) {
		super(message);
		this.name = 'Order Error';
		this.status = 400;
	}
}
