import { ClientDTO } from './client';
import { EntityDTO } from './entity';
import { PizzaDTO } from './pizza';

export class OrderDTO implements EntityDTO {
	id?: number;
	pizzas?: PizzaDTO[];
	client?: ClientDTO;
}
