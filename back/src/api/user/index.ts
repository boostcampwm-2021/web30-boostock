import express from 'express';
import user from './user';
import balance from './balance';
import favorite from './favorite';
import hold from './hold';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', user());
	router.use('/', hold());
	router.use('/', balance());
	router.use('/', favorite());

	return router;
};
