import logValidator from '@api/middleware/logValidator';
import ParamError, { ParamErrorMessage } from '@errors/ParamError';
import { CHARTTYPE_VALUE } from '@interfaces/IChartLog';
import StockService from '@services/StockService';
import express, { NextFunction, Request, Response } from 'express';

export default (): express.Router => {
	const router = express.Router();

	router.get('/log', logValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { code, start, end, type } = res.locals;
			const log = await StockService.getStockLog(code, type as CHARTTYPE_VALUE, start, end);
			console.log(log);
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
