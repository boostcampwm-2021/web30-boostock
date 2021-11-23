import EventEmitter from '@helper/eventEmitter';
import AuctioneerService from '@services/AuctioneerService';

const auctioneerServiceInstance = new AuctioneerService();

let runningState = '';
const waitingQueue: string[] = [];
const waitingSet = new Set();

const startAuctioneer = (stockCode) => {
	runningState = stockCode;
};
const quitAuctioneer = (stockCode) => {
	runningState = '';
	waitingSet.delete(stockCode);
};
const runAuctioneer = async (): Promise<void> => {
	const stockCode = waitingQueue.pop();

	startAuctioneer(stockCode);
	while (await auctioneerServiceInstance.bidAsk(stockCode));
	quitAuctioneer(stockCode);

	if (waitingQueue.length) runAuctioneer();
};

EventEmitter.on('waiting', (stockCode: string): void => {
	if (runningState === stockCode || waitingSet.has(stockCode)) return;
	waitingQueue.unshift(stockCode);
	waitingSet.add(stockCode);
	if (!runningState) runAuctioneer();
});

export default runAuctioneer;
