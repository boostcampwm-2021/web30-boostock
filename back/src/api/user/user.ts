import express, { Request, Response } from 'express';
import UserService from '@services/user';
import { User } from '@models/index';

export default (): express.Router => {
	const router = express.Router();
	router.get('/', async (req: Request, res: Response) => {
		return res.status(200).send('heartbeat!').end();
		// const userServiceInstance = new UserService();
		// const users = await userServiceInstance.Find();
		// res.status(200).json(users);
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
