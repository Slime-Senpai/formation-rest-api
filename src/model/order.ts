import { Entity } from './entity';

export class Order implements Entity {
	id?: number;
	pizzas?: number[];
	client?: number;
}
