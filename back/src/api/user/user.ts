import express, { Request, Response } from 'express';
import { User } from '@models/index';
import { UserService } from '@services/index';
import { CommonError } from '@services/errors/index';
import { QueryRunner, transaction } from '@helper/tools';

export default (): express.Router => {
	const router = express.Router();

	router.get('/', (req: Request, res: Response) => {
		transaction(
			req,
			res,
			(
				queryRunner: QueryRunner,
				then: () => void,
				err: (err: CommonError) => void,
				fin: () => void,
			) => {
				const loggedUserID = Number(req.cookies.id) || 0;
				const userServiceInstance = new UserService();
				userServiceInstance
					.getUserById(queryRunner.manager, loggedUserID)
					.then((users: User) => {
						res.status(200).json(users).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
		);
	});

	router.post('/', async (req: Request, res: Response) => {
		transaction(
			req,
			res,
			(
				queryRunner: QueryRunner,
				then: () => void,
				err: (err: CommonError) => void,
				fin: () => void,
			) => {
				const userServiceInstance = new UserService();
				userServiceInstance
					.signUp(queryRunner.manager, {
						username: req.body.username,
						email: req.body.email,
						social_github: '0',
					})
					.then(() => {
						res.status(200).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
		);
	});

	router.delete('/', async (req: Request, res: Response) => {
		transaction(
			req,
			res,
			(
				queryRunner: QueryRunner,
				then: () => void,
				err: (err: CommonError) => void,
				fin: () => void,
			) => {
				const loggedUserID = Number(req.cookies.id) || 0;
				const userServiceInstance = new UserService();
				userServiceInstance
					.getUserById(queryRunner.manager, loggedUserID)
					.then((users: User) => {
						res.status(200).json(users).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
		);
	});

	// 테스트용 임시 로그인 시스템
	// 페이지 진입 시, 1~3번 중 1개의 ID 선택되어 쿠키에 설정됨
	// req.cookie.id를 통해 접근
	router.get('/login', async (req: Request, res: Response) => {
		res.cookie('id', 1 + Math.floor(Math.random() * 3), {
			expires: new Date(Date.now() + 999999),
			httpOnly: true,
		});

		res.status(200).end();
	});

	// 테스트용 임시 로그아웃 시스템
	// req.cookie.id 제거
	router.get('/logout', async (req: Request, res: Response) => {
		res.clearCookie('id');
		res.status(200).end();
	});

	return router;
};
