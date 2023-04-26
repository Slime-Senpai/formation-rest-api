import { Client, Order, Pizza } from '../model';
import { CrudRepository } from './crudRepository';

export class OrderRepository extends CrudRepository<Order> {
	constructor() {
		const fieldsToFill = new Map();
		fieldsToFill.set('client', Client);
		fieldsToFill.set('pizzas', Pizza);

		super(Order, fieldsToFill);
	}
}
