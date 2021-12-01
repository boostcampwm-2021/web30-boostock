import express, { NextFunction, Request, Response } from 'express';
import { UserStockService } from '@services/index';
import sessionValidator from '@api/middleware/sessionValidator';

export default (): express.Router => {
	const router = express.Router();

	router.get('/hold', sessionValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			const result = await UserStockService.readWithStockInfo(userId);
			const holdStocks = result.map((elem) => {
				return {
					amount: elem.amount,
					average: elem.average,
					code: elem.stock.code,
					nameKorean: elem.stock.nameKorean,
					nameEnglish: elem.stock.nameEnglish,
				};
			});

			res.status(200).json({ holdStocks });
		} catch (error) {
			next(error);
		}
	});

	return router;
};
