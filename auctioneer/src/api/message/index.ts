import express from 'express';
import message from './message';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', message());

	return router;
};
