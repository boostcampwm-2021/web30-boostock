import ParamError, { ParamErrorMessage } from '@errors/ParamError';
import { CHARTTYPE } from '@interfaces/IChartLog';
import { Request, Response, NextFunction } from 'express';

const logValidator = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const { code, start, end } = req.query;
		const type = Number(req.query.type);
		if (
			code === undefined ||
			type === undefined ||
			start === undefined ||
			end === undefined ||
			!Object.values(CHARTTYPE).find((elem) => elem === type)
		)
			throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		res.locals = { code, start: Number(start), end: Number(end), type };

		next();
	} catch (error) {
		next(error);
	}
};

export default logValidator;
