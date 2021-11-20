const formatNumber = (num: number | string): string => {
	const convertedNum = Number(num);
	return new Intl.NumberFormat('en-us').format(convertedNum);
};

export default formatNumber;
