import { Entity } from './entity';

export class Client implements Entity {
	id?: number;
	name?: string;
	lastname?: string;
	address?: string;
}
