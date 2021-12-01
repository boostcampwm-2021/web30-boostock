/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Chart } from './index';

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

	@OneToMany(() => Chart, (chart: Chart) => chart.stockId)
	charts: Chart[];
}
