import express, { NextFunction, Request, Response } from 'express';
import { GithubService, UserService } from '@services/index';
import { IGithubUserInfo } from '@interfaces/GithubUserInfo';

export default (): express.Router => {
	const router = express.Router();

	router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
		const { code } = req.body;
		try {
			const accessToken = await GithubService.getAccessToken(code);
			const userInfo = await GithubService.getUserInfo(accessToken);
			Object.assign(req.session.data, userInfo);
			req.session.save((err) => {
				if (err) next(err);
				return res.status(200);
			});
		} catch (error) {
			next(error);
		}
	});

	router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
		const { code, username, email } = req.body;
		try {
			const accessToken = await GithubService.getAccessToken(code);
			const userInfo: IGithubUserInfo = await GithubService.getUserInfo(accessToken);
			if (await UserService.signUp({ username, email, socialGithub: userInfo.username })) {
				Object.assign(req.session.data, userInfo);
				req.session.save((err) => {
					if (err) next(err);
					return res.status(200);
				});
			}
		} catch (error) {
			next(error);
		}
	});

	return router;
};
