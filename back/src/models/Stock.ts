import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Stock {
	@PrimaryGeneratedColumn()
	stock_id: number;

	@Column({ unique: true })
	code: string;

	@Column()
	name: string;

	@Column()
	unit: number;
}
