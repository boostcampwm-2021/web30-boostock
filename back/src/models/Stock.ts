import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Stock {
	@PrimaryGeneratedColumn()
	stock_id: number;

	@Column()
	name: string;
}
