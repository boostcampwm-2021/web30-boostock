import schedule from 'node-schedule';
import { ScheduleService } from '@services/index';
import { CHARTTYPE } from '@interfaces/IChartLog';
import Logger from './logger';

const chartLogger = (): void => {
	const candleMinutes = schedule.scheduleJob('* * * * *', () => {
		new ScheduleService().runAllChart(CHARTTYPE.MINUTES);
		Logger.info('Minutes scheduled');
	});
	const candleDays = schedule.scheduleJob('0 0 * * *', () => {
		new ScheduleService().runAllChart(CHARTTYPE.DAYS);
		Logger.info('Days scheduled');
	});
};

export default chartLogger;
