/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import Stock from './Stock';

@Entity('chart')
export default class Chart {
	@PrimaryGeneratedColumn({ name: 'chart_id' })
	chartId: number;

	@ManyToOne(() => Stock, (stock: Stock) => stock.stockId, { cascade: ['update'] })
	@JoinColumn({ name: 'stock_id', referencedColumnName: 'stockId' })
	stock: Stock;

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

	@Column()
	amount: number;

	@Column()
	volume: number;
}
