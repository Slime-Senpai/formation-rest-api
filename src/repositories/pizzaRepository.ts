import { EntityDTO } from '../dto';
import { Ingredient, Pizza } from '../model';
import { CrudRepository } from './crudRepository';

export class PizzaRepository extends CrudRepository<Pizza> {
	constructor() {
		const fieldsToFill = new Map();
		fieldsToFill.set('ingredients', Ingredient);

		super(Pizza, fieldsToFill);
	}

	create(item: Pizza): EntityDTO {
		item.likes = 0;

		return super.create(item);
	}
}
