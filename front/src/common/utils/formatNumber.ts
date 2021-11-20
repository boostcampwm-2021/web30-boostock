const formatNumber = (num: number | string): string => new Intl.NumberFormat('en-us').format(num);

export default formatNumber;
