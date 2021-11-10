import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Stock {
	@PrimaryGeneratedColumn()
	stock_id: number;

	@Column({ unique: true })
	code: string;

	@Column()
	name_korean: string;

	@Column()
	name_english: string;

	@Column()
	price: number;

	@Column()
	previous_close: number;

	@Column()
	unit: number;
}
