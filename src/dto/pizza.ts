import { EntityDTO } from './entity';
import { IngredientDTO } from './ingredient';

export class PizzaDTO implements EntityDTO {
	id?: number;
	name?: string;
	description?: string;
	price?: number;
	ingredients?: IngredientDTO[];
}
