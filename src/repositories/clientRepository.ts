import { Client } from '../model';
import { CrudRepository } from './crudRepository';

export class ClientRepository extends CrudRepository<Client> {
	constructor() {
		super(Client, new Map());
	}
}
