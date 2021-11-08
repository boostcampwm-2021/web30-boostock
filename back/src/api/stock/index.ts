import express from 'express';
import stock from './stock';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', stock());

	return router;
};
