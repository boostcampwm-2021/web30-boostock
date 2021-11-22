import CommonError from './CommonError';

export enum StockErrorMessage {
	NOT_EXIST_STOCK = 'Not Exist Stock',
}

export default class StockError extends CommonError {
	constructor(message: StockErrorMessage | string) {
		super(message);
		this.name = 'Stock Error';
		this.status = 400;
	}
}
