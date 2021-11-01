import express from 'express';
import user from './user';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', user);

	return router;
};
