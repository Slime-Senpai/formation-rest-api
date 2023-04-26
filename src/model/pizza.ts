import { Entity } from './entity';

export class Pizza implements Entity {
	id?: number;
	name?: string;
	description?: string;
	price?: number;
	ingredients?: number[];
	likes: number = 0;
}
