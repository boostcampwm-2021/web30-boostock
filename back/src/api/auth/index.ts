import express from 'express';
import signout from './signout';
import github from './github';

export default (): express.Router => {
	const router = express.Router();
	router.use('/github', github());
	router.use('/', signout());

	return router;
};
