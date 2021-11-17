export interface IHold {
	stockCode: string;
	stockName: string;

	holdAmount: number;
	averageAskPrice: number;
	totalAskPrice: number;

	totalValuationPrice: number;
	totalValuationProfit: number;
}
