import { Ingredient } from '../model/ingredient';
import { CrudRepository } from './crudRepository';

export class IngredientRepository extends CrudRepository<Ingredient> {
	constructor() {
		super(Ingredient, new Map());
	}
}
