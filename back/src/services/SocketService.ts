import Emitter from '@helper/eventEmitter';
import { binArrayToJson, JsonToBinArray } from '@helper/tools';
import { StockError, StockErrorMessage } from '@errors/index';
import { ISocketRequest } from '../interfaces/socketRequest';
import StockService from './StockService';

const loginUserMap = new Map();
const socketClientMap = new Map();
const socketAlarmMap = new Map();
const translateRequestFormat = (data) => binArrayToJson(data);
const translateResponseFormat = (type, data) => JsonToBinArray({ type, data });
const getNemClientForm = () => {
	return { target: '', alarmToken: '' };
};
const connectNewUser = async (client) => {
	try {
		const stockService = new StockService();
		const stockList = await stockService.getStocksCurrent();

		client.send(translateResponseFormat('STOCKS_INFO', stockList));
		socketClientMap.set(client, getNemClientForm());
	} catch (error) {
		throw new StockError(StockErrorMessage.CANNOT_READ_STOCK_LIST);
	}
};
const disconnectUser = (client) => {
	const { alarmToken } = socketClientMap.get(client);
	const userId = loginUserMap.get(alarmToken);
	socketAlarmMap.delete(userId);
	socketClientMap.delete(client);
};
const logoutUserHandler = (alarmToken) => {
	const logoutUser = loginUserMap.get(alarmToken);
	const logoutSocket = socketAlarmMap.get(logoutUser);

	loginUserMap.delete(alarmToken);
	socketAlarmMap.delete(logoutUser);
	socketClientMap.set(logoutSocket, { ...socketClientMap.get(logoutSocket), alarmToken: '' });
};
const broadcast = ({ stockCode, msg }) => {
	socketClientMap.forEach(({ target: targetStockCode }, client) => {
		if (targetStockCode === stockCode) {
			// 모든 데이터 전송, 현재가, 호가, 차트 등...
			client?.send(translateResponseFormat('UPDATE_TARGET', msg));
		} else {
			// msg 오브젝트의 데이터에서 aside 바에 필요한 데이터만 골라서 전송
			client?.send(translateResponseFormat('UPDATE_STOCK', msg.match));
		}
	});
};
const sendOrderMessage = ({ stockCode, msg }) => {
	socketClientMap.forEach(({ target: targetStockCode }, client) => {
		if (targetStockCode !== stockCode) return;
		client?.send(translateResponseFormat('ORDER', msg));
	});
};
const sendAlarmMessage = (userId, msg) => {
	const client = socketAlarmMap.get(userId);
	client?.send(translateResponseFormat('NOTICE', msg));
};
const sendNewChart = (stockCharts) => {
	socketClientMap.forEach(({ target: targetStockCode }, client) => {
		if (!stockCharts[targetStockCode]) return;
		client.send(translateResponseFormat('CHART', stockCharts[targetStockCode]));
	});
};
const loginUser = (userId, alarmToken) => {
	loginUserMap.set(alarmToken, userId);
};
const registerAlarmToken = (ws, alarmToken) => {
	socketClientMap.set(ws, { ...socketClientMap.get(ws), alarmToken });
	const userId = loginUserMap.get(alarmToken);
	if (userId) socketAlarmMap.set(userId, ws);
};

export default (webSocketServer): void => {
	webSocketServer.on('connection', async (ws, req) => {
		await connectNewUser(ws);

		ws.on('message', async (message: string) => {
			const requestData: ISocketRequest = translateRequestFormat(message);

			switch (requestData.type) {
				case 'open': {
					if (!socketClientMap.has(ws)) return;
					const stockService = new StockService();
					const stockCode = requestData.stockCode ?? '';
					const conclusions = await stockService.getConclusionByCode(stockCode);

					ws.send(translateResponseFormat('BASE_STOCK', { stockCode, conclusions }));
					socketClientMap.set(ws, { ...socketClientMap.get(ws), target: stockCode });
					break;
				}
				case 'alarm': {
					const { alarmToken } = requestData;
					registerAlarmToken(ws, alarmToken);
					break;
				}
				default:
					ws.send(translateResponseFormat('ERROR', '알 수 없는 오류가 발생했습니다.'));
			}
		});

		ws.on('close', () => {
			disconnectUser(ws);
		});
	});
};

Emitter.on('BROADCAST', broadcast);
Emitter.on('LOGIN_USER', loginUser);
Emitter.on('ACCEPTED_ORDER', sendOrderMessage);
Emitter.on('NOTICE', sendAlarmMessage);
Emitter.on('CHART', sendNewChart);
Emitter.on('LOGOUT', logoutUserHandler);
