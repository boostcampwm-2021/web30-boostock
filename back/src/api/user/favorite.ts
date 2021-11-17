import express, { NextFunction, Request, Response } from 'express';
import { StockService, UserFavoriteService } from '@services/index';
import { AuthError, AuthErrorMessage } from '@services/errors/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/favorite', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const userFavorite = await UserFavoriteService.getUserFavoriteByUserId(userId);
			const favorite = userFavorite.map((elem) => elem.code);
			res.status(200).json({ favorite });
		} catch (error) {
			next(error);
		}
	});

	router.post('/favorite', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { stockCode } = req.body;
			const stockId = await StockService.getStockIdByCode(stockCode);
			await UserFavoriteService.createUserFavorite(userId, stockId); // UserFavorite
			res.status(200).json({ code: stockCode });
		} catch (error) {
			next(error);
		}
	});

	router.delete('/favorite', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { stockCode } = req.body;
			const stockId = await StockService.getStockIdByCode(stockCode);
			await UserFavoriteService.removeUserFavorite(userId, stockId);
			res.status(200).json({ code: stockCode });
		} catch (error) {
			next(error);
		}
	});

	return router;
};
