import express, { NextFunction, Request, Response } from 'express';
import { AuthError, AuthErrorMessage, ParamError, ParamErrorMessage } from '@services/errors/index';
import { UserService } from '@services/index';
import UserBalance, { IBalanceHistory } from '@models/UserBalance';

const COUNT_PER_PAGE = 30;

enum BalanceTransperType {
	WITHDRAW = 0,
	DEPOSIT = 1,
}

enum BalanceTransperStatus {
	PENDING = 0,
	FINISHED = 1,
}

export default (): express.Router => {
	const router = express.Router();
	router.get('/balance', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const page = req.body.page ? req.body.page * COUNT_PER_PAGE * -1 : 0;
			const result = await UserService.getUserById(userId);
			const { balance } = result;
			const document = await UserBalance.findOne({ userId }, { balanceHistory: { $slice: [page, COUNT_PER_PAGE] } });
			const history = document?.balanceHistory;
			res.status(200).json({ balance, history });
		} catch (error) {
			next(error);
		}
	});

	router.post('/balance/deposit', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { bank, bankAccount } = req.body;
			let { changeValue } = req.body;
			changeValue = Number(changeValue);
			if (
				changeValue === undefined ||
				Number.isNaN(changeValue) ||
				bank === undefined ||
				bankAccount === undefined ||
				changeValue <= 0 ||
				changeValue >= 10000000000
			)
				throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			const result = await UserService.updateBalance(userId, changeValue);
			const { balance } = result;
			res.status(200).json({ balance });

			const newBalanceHistory: IBalanceHistory = {
				type: BalanceTransperType.DEPOSIT,
				volume: changeValue < 0 ? changeValue * -1 : changeValue,
				status: BalanceTransperStatus.FINISHED,
				bank,
				bankAccount,
				createdAt: new Date().getTime(),
			};

			const document = await UserBalance.findOne({ userId });
			if (document) {
				document.balanceHistory.push(newBalanceHistory);
				document.save((err) => {
					if (err) throw err;
				});
			} else {
				const newDocument = new UserBalance({
					userId,
				});
				newDocument.balanceHistory.push(newBalanceHistory);
				newDocument.save();
			}
		} catch (error) {
			next(error);
		}
	});

	router.post('/balance/withdraw', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { changeValue, bank, bankAccount } = req.body;
			if (
				changeValue === undefined ||
				Number.isNaN(Number(changeValue)) ||
				bank === undefined ||
				bankAccount === undefined ||
				changeValue <= 0 ||
				changeValue >= 10000000000
			)
				throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			const result = await UserService.updateBalance(userId, changeValue);
			const { balance } = result;
			res.status(200).json({ balance });

			const newBalanceHistory: IBalanceHistory = {
				type: BalanceTransperType.WITHDRAW,
				volume: changeValue < 0 ? changeValue * -1 : changeValue,
				status: BalanceTransperStatus.FINISHED,
				bank,
				bankAccount,
				createdAt: new Date().getTime(),
			};

			const document = await UserBalance.findOne({ userId });
			if (document) {
				document.balanceHistory.push(newBalanceHistory);
				document.save((err) => {
					if (err) throw err;
				});
			} else {
				const newDocument = new UserBalance({
					userId,
				});
				newDocument.balanceHistory.push(newBalanceHistory);
				newDocument.save();
			}
		} catch (error) {
			next(error);
		}
	});

	return router;
};
