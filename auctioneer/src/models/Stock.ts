/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Order } from './index';

@Entity()
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

	@OneToMany(() => Order, (order: Order) => order.orderId)
	@JoinColumn({ name: 'stock_id', referencedColumnName: 'stock_id' })
	orders: Order[];
}
