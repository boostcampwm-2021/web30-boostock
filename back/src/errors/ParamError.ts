import CommonError from './CommonError';

export enum ParamErrorMessage {
	INVALID_PARAM = 'INVALID PARAM',
	BALANCE_CANNOT_BE_NEGATIVE = 'BALANCE_CANNOT_BE_NEGATIVE',
}

export default class ParamError extends CommonError {
	constructor(message: ParamErrorMessage | string) {
		super(message);
		this.name = 'Order Error';
		this.status = 400;
	}
}
