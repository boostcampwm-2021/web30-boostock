import CommonError from './CommonError';

export enum ValidationErrorMessage {
	NOT_INTEGER_VALUE = 'Not Integer Value',
	NOT_FLOAT_VALUE = 'Not Float Value',
	NOT_POSITIVE_VALUE = 'Not Positive Value',
	NOT_NEGATIVE_VALUE = 'Not Negative Value',
	NOT_STRING_VALUE = 'Not String Value',
	NOT_INCLUDED_VALUE = 'Not Included Value',
	NOT_CORRECT_QUOTE = 'Not Correct Quote Digit',
}
export default class ValidationError extends CommonError {
	constructor(message: ValidationErrorMessage | string) {
		super(message);
		this.name = 'Validation Error';
		this.status = 405;
	}
}
