import { Request, Response, NextFunction } from 'express';
import Validator from '@helper/Validator';
import { ORDERTYPE } from '@models/AskOrder';
import { ParamError, ParamErrorMessage, ValidationError, ValidationErrorMessage } from 'errors';
import config from '@config/index';

const QUOTE_DIGIT = 1000;
const QUOTE_RATE = 1;
const MIN_QUOTE = 1;
const BASE_NUM = 10;
const MATCH_NUM = 0;

const isCorrectQuote = (price: number) => {
	const quote = MIN_QUOTE * BASE_NUM ** (Math.floor(price / QUOTE_DIGIT).toString().length - QUOTE_RATE);
	if (price % quote !== MATCH_NUM) throw new ValidationError(ValidationErrorMessage.NOT_CORRECT_QUOTE);
};

export const orderValidator = (req: Request, res: Response, next: NextFunction): void => {
	const validator = new Validator();
	const { stockCode, type, amount, price } = req.body;

	try {
		validator.init(stockCode).isString();
		validator.init(type).isInObject(ORDERTYPE).isInteger();
		validator.init(amount).isInteger().isPositive();
		validator.init(price).isInteger().isPositive();
		isCorrectQuote(price);

		if (
			!stockCode ||
			!type ||
			!amount ||
			!price ||
			price <= 0 ||
			price > config.maxPrice ||
			amount <= 0 ||
			amount > config.maxAmount
		)
			throw new ParamError(ParamErrorMessage.INVALID_PARAM);

		next();
	} catch (err) {
		next(err);
	}
};

export const stockIdValidator = (req: Request, res: Response, next: NextFunction): void => {
	const validator = new Validator();
	try {
		validator.init(req.query.stockId).isInteger().isPositive();
		next();
	} catch (err) {
		next(err);
	}
};

export const balanceValidator = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const { bank, bankAccount, changeValue } = req.body;
		if (
			!changeValue ||
			Number.isNaN(changeValue) ||
			!bank ||
			!bankAccount ||
			changeValue <= 0 ||
			changeValue >= config.maxTransperMoney
		)
			throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		next();
	} catch (err) {
		next(err);
	}
};
