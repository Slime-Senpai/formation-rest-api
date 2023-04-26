import { EntityDTO } from './entity';

export class ClientDTO implements EntityDTO {
	id?: number;
	name?: string;
	lastname?: string;
	address?: string;
}
