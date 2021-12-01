import schedule from 'node-schedule';
import { ScheduleService } from '@services/index';
import { CHARTTYPE } from '@interfaces/IChartLog';
import Logger from './logger';

const chartLogger = (): void => {
	schedule.scheduleJob('* * * * *', () => {
		new ScheduleService().runAllChart(CHARTTYPE.MINUTES);
		Logger.info('Minutes scheduled');
	});
	schedule.scheduleJob('0 0 * * *', () => {
		new ScheduleService().runAllChart(CHARTTYPE.DAYS);
		Logger.info('Days scheduled');
	});
};

export default chartLogger;
