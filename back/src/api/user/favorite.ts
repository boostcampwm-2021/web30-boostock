import express, { NextFunction, Request, Response } from 'express';
import { UserFavoriteService } from '@services/index';
import { AuthError, AuthErrorMessage } from 'errors/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/favorite', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const userFavorite = await UserFavoriteService.readByUserId(userId);
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
			await UserFavoriteService.createUserFavorite(userId, stockCode);
			res.status(201).json({});
		} catch (error) {
			next(error);
		}
	});

	router.delete('/favorite', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { stockCode } = req.body;
			await UserFavoriteService.removeUserFavorite(userId, stockCode);
			res.status(201).json({});
		} catch (error) {
			next(error);
		}
	});

	return router;
};
