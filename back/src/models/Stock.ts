import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle
import Chart from './Chart';

@Entity({ name: 'stock' })
export default class Stock {
	@PrimaryGeneratedColumn({ name: 'stock_id' })
	stockId: number;

	@Column({ unique: true })
	code: string;

	@Column({ name: 'name_korean' })
	nameKorean: string;

	@Column({ name: 'name_english' })
	nameEnglish: string;

	@Column()
	price: number;

	@Column({ name: 'previous_close' })
	previousClose: number;

	@OneToMany(() => Chart, (chart: Chart) => chart.stockId)
	charts: Chart[];
}
