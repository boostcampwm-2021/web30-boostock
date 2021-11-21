import express, { NextFunction, Request, Response } from 'express';
import { GithubService, UserService } from '@services/index';
import { generateUUID } from '@helper/tools';
import eventEmitter from '@helper/eventEmitter';

export default (): express.Router => {
	const router = express.Router();

	router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
		const { code } = req.body;
		try {
			const accessToken = await GithubService.getAccessToken(code);
			const githubUserInfo = await GithubService.getUserInfo(accessToken);
			const userInfo = await UserService.getUserBySocialGithub(githubUserInfo.login);
			const alarmToken = generateUUID();

			if (userInfo.userId === undefined) return;
			req.session.data = {
				userId: userInfo.userId,
				email: userInfo.email,
			};

			const error = await req.session.save();
			if (error) throw error;

			res.status(200).json({ alarmToken });
			eventEmitter.emit('loginUser', userInfo.userId, alarmToken);
		} catch (error) {
			next(error);
		}
	});

	router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
		const { code, username, email } = req.body;
		try {
			const accessToken = await GithubService.getAccessToken(code);
			const githubUserInfo = await GithubService.getUserInfo(accessToken);
			const userInfo = await UserService.signUp({ username, email, socialGithub: githubUserInfo.login });
			const alarmToken = generateUUID();

			req.session.data = {
				userId: userInfo.userId,
				email: userInfo.email,
			};

			const error = await req.session.save();
			if (error) throw error;

			res.status(200).json({ alarmToken });
			eventEmitter.emit('loginUser', userInfo.userId, alarmToken);
		} catch (error) {
			next(error);
		}
	});

	return router;
};
