import express from 'express';
import user from './user';
import balance from './balance';
import favorite from './favorite';
import hold from './hold';
import transaction from './transaction';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', user());
	router.use('/', hold());
	router.use('/', balance());
	router.use('/', favorite());
	router.use('/', transaction());

	return router;
};
