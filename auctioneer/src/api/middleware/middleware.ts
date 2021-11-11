import { Request, Response, NextFunction } from 'express';
import Stock from '@models/Stock';
import { getRepository } from 'typeorm';

export async function code2StockId(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	const { code } = req.query;
	if (code === undefined) next('code가 빠졌어');
	const stockRepository = getRepository(Stock);
	const stockId = await stockRepository.findOne({ code: code as string });
	if (stockId === undefined) next('code가 엉뚱한게 드렁왔엉');
	res.locals.stockId = stockId;
	next();
}

export function avoidLint() {
	return undefined;
}
