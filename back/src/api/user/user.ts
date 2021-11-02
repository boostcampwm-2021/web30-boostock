import express, { Request, Response } from 'express';
import User from '@models/User';
import UserService from '@services/UserService';

export default (): express.Router => {
	const router = express.Router();
	router.get('/', async (req: Request, res: Response) => {
		const userServiceInstance = new UserService();
		const users = await userServiceInstance.getLoggedUser();
		res.status(200).json(users);
	});
	router.get('/new', async (req: Request, res: Response) => {
		const userServiceInstance = new UserService();
		const user = new User();
		user.username = 'test';
		user.email = 'test@naver.com';
		user.social_github = '0';
		user.balance = 0;
		await userServiceInstance.signUp(user);
		res.status(200);
	});
	router.get('/:id', async (req: Request, res: Response) => {
		res.send('heartbeat!');
		// const userServiceInstance = new UserService();
		// const result = await userServiceInstance.FindOne(req.params.id);
		// res.status(200).json(result);
	});
	router.post('/', async (req: Request, res: Response) => {
		res.send('heartbeat!');
		// const userServiceInstance = new UserService();
		// const result = userServiceInstance.SignUp(req.body as User);
		// res.status(200).json(result);
	});
	router.put('/:id', async (req: Request, res: Response, next) => {
		res.send('heartbeat!');
		// const userserviceinstance = new userservice();
		// const result = userserviceinstance.updatefirstname(
		// 	req.params.id,
		// 	req.params.firstname,
		// );

		// if (result === null) {
		// 	next(new Error('can not find'));
		// }
		// res.status(200).json(result);
	});
	router.delete('/:id', async (req: Request, res: Response) => {
		res.send('heartbeat!');
		// const userServiceInstance = new UserService();
		// const results = await userServiceInstance.Delete(
		// 	parseInt(req.params.id, 10),
		// );
		// res.status(200).json(results);
	});
	return router;
};
