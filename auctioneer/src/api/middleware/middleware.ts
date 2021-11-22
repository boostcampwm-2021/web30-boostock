import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Stock from '@models/Stock';
import { ParamError, ParamErrorMessage } from 'errors';

export async function code2StockId(req: Request, res: Response, next: NextFunction): Promise<void> {
	const { code } = req.query;
	if (code === undefined) next(new ParamError(ParamErrorMessage.INVALID_PARAM));
	const stockRepository = getRepository(Stock);
	try {
		const stock = await stockRepository.findOne({ code: code as string });
		if (stock === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		res.locals.stockId = stock.stockId;
		res.locals.code = code;
	} catch (error) {
		next(error);
	}
	next();
}

export function avoidLint() {
	return undefined;
}
