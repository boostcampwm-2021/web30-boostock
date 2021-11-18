import CommonError from './CommonError';

export enum StockErrorMessage {
	NOT_EXIST_STOCK = 'Not Exist Stock',
	CANNOT_READ_STOCK = 'Cannot Read Stock',
	CANNOT_READ_STOCK_LIST = 'Cannot Read Stock list',
}

export default class StockError extends CommonError {
	constructor(message: StockErrorMessage | string) {
		super(message);
		this.name = 'Stock Error';
		this.status = 400;
	}
}
