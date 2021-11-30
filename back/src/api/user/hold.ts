import express, { NextFunction, Request, Response } from 'express';
import { AuthError, AuthErrorMessage } from 'errors/index';
import { UserStockService } from '@services/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/hold', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
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
