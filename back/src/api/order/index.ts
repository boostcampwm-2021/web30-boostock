import express from 'express';
import order from './order';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', order());

	return router;
};
