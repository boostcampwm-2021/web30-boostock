import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chart')
export default class Chart {
	@PrimaryGeneratedColumn({ name: 'chart_id' })
	chartId: number;

	@Column({ name: 'stock_id' })
	stockId: number;

	@Column()
	type: number;

	@Column({ name: 'price_before' })
	priceBefore: number;

	@Column({ name: 'price_start' })
	priceStart: number;

	@Column({ name: 'price_end' })
	priceEnd: number;

	@Column({ name: 'price_high' })
	priceHigh: number;

	@Column({ name: 'price_low' })
	priceLow: number;

	@Column({ type: 'bigint' })
	amount: string;

	@Column({ type: 'bigint' })
	volume: string;
}
