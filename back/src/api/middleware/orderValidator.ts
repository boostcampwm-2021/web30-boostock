import Validator from '@helper/Validator';
import { OrderType } from '@models/Order';
import { ValidationError, ValidationErrorMessage } from '@services/errors';

const QUOTE_DIGIT = 1000;
const QUOTE_RATE = 1;
const MIN_QUOTE = 1;
const BASE_NUM = 10;
const MATCH_NUM = 0;

const isCorrectQuote = (price) => {
	const quote = MIN_QUOTE * BASE_NUM ** (Math.floor(price / QUOTE_DIGIT).toString().length - QUOTE_RATE);
	if (price % quote !== MATCH_NUM) throw new ValidationError(ValidationErrorMessage.NOT_CORRECT_QUOTE);
};

const orderValidator = async (req, res, next) => {
	const validator = new Validator();

	try {
		validator.init(1).isInteger();
		validator.init(req.body.stockCode).isString();
		validator.init(req.body.type).isInObject(OrderType).isInteger();
		validator.init(req.body.amount).isInteger().isPositive();
		validator.init(req.body.price).isInteger().isPositive();
		isCorrectQuote(req.body.price);

		next();
	} catch (err) {
		next(err);
	}
};

export default orderValidator;
