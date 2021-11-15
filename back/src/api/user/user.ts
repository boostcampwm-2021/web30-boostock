import express, { Request, Response } from 'express';
import { User } from '@models/index';
import { UserService } from '@services/index';
import { CommonError } from '@services/errors/index';
import { QueryRunner, transaction, Validator } from '@helper/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/', (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, then: () => void, err: (err: CommonError) => void, fin: () => void) => {
				const userServiceInstance = new UserService();
				const validator = new Validator();
				userServiceInstance
					.getUserById(queryRunner.manager, validator.init(1).isInteger().toNumber())
					.then((users: User) => {
						res.status(200).json(users).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
			req,
			res,
		);
	});

	router.post('/', async (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, then: () => void, err: (err: CommonError) => void, fin: () => void) => {
				const validator = new Validator();
				UserService.signUp({
					username: validator.init(req.body.username).isString().toString(),
					email: validator.init(req.body.email).isString().toString(),
					socialGithub: validator.init(0).isString().toString(),
				})
					.then(() => {
						res.status(200).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
			req,
			res,
		);
	});

	router.delete('/', async (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, then: () => void, err: (err: CommonError) => void, fin: () => void) => {
				const userServiceInstance = new UserService();
				const validator = new Validator();
				userServiceInstance
					.getUserById(queryRunner.manager, validator.init(1).isInteger().toNumber())
					.then((users: User) => {
						res.status(200).json(users).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
			req,
			res,
		);
	});

	return router;
};
