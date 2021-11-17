export default function AsyncHelper(fn) {
	return (req, res, next): void => {
		fn(req, res, next).catch(next);
	};
}
