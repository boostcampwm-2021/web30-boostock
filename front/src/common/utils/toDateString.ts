export default (timestamp: number) => {
	return new Date(timestamp).toISOString().replace('T', ' ').replace(/\..*/, '');
};
