const snakeToCamel = (str) => {
	return str.toLowerCase().replace(/([-_][a-z])/g, (group) => {
		return group.toUpperCase().replace('-', '').replace('_', '');
	});
};
const camelToSnake = (str) => {
	return str.replace(/[A-Z]/g, (letter) => {
		return `_${letter.toLowerCase()}`;
	});
};

export { snakeToCamel, camelToSnake };
