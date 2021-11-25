import ParamError, { ParamErrorMessage } from '@errors/ParamError';
import { CHARTTYPE, CHARTTYPE_VALUE } from '@interfaces/IChartLog';
import StockService from '@services/StockService';
import express, { NextFunction, Request, Response } from 'express';

export default (): express.Router => {
	const router = express.Router();

	router.get('/log', async (req: Request, res: Response, next: NextFunction) => {
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
			const log = await StockService.getStockLog(
				code as string,
				Number(type) as CHARTTYPE_VALUE,
				Number(start),
				Number(end),
			);
			res.status(200).json({ log });
		} catch (error) {
			next(error);
		}
	});

	router.get('/log/daily', async (req: Request, res: Response, next: NextFunction) => {
		const { code } = req.query;
		if (!code) throw new ParamError(ParamErrorMessage.INVALID_PARAM);

		try {
			const stockService = new StockService();
			const dailyLogs = await stockService.getDailyLogs(code as string);

			res.status(200).json({ code, logs: dailyLogs });
		} catch (error) {
			next(error);
		}
	});

	return router;
};
