import { dataSourceFactory } from '../db';
import { EntityDTO } from '../dto';
import { Entity } from '../model';
import { log } from '../utils';

const repositories = new Map<{ new (): Entity }, CrudRepository<any>>();

export { repositories as repositoriesList };

/**
 * Manages the basic CRUD functions for a basic datasource
 */
export class CrudRepository<T extends Entity> {
	protected dataSource: Map<number, T>;
	fieldsToFill: Map<keyof T, { new (): Entity }>;

	private lastUsedID = 0;

	/**
	 *
	 * @param ctor The constructor of the entity
	 * @param fieldsToFill The fields containing the ids of the child entities
	 */
	constructor(
		ctor: { new (): T },
		fieldsToFill: Map<keyof T, { new (): Entity }>
	) {
		this.dataSource = dataSourceFactory.getDataSource(ctor);
		this.fieldsToFill = fieldsToFill;
		repositories.set(ctor, this);
	}

	/**
	 * Gets an entity from the datasource using its id and its constructor
	 *
	 * @param id The id of the entity
	 * @param entityCtor The constructor of the entity
	 * @returns The found entity
	 */
	private idToObject<U extends Entity>(
		id: number,
		entityCtor: { new (): U }
	): U | undefined {
		const fieldDataSource = dataSourceFactory.getDataSource(entityCtor);

		return fieldDataSource.get(id);
	}

	/**
	 * Fills an item with the entities corresponding to the ids defined in the fieldsToFill map
	 * For now, it cannot handle circular dependencies and will loop infinitely if asked to fill those
	 *
	 * @param item The item to fill the ids of
	 * @returns The filled item
	 */
	private fillIds<DTO extends EntityDTO>(item: T): DTO {
		// HACK Maybe something better to do than any ?
		const newDTO: any = { ...item };
		for (const [field, entityCtor] of this.fieldsToFill) {
			const value = item[field];

			if (Array.isArray(value) && typeof value[0] === 'number') {
				const newValue = [];
				for (const id of value) {
					const foundObject = this.idToObject(id, entityCtor);

					if (foundObject !== undefined) {
						const entityRepository = repositories.get(entityCtor);

						if (entityRepository) {
							newValue.push(entityRepository.fillIds(foundObject));
						} else {
							newValue.push(foundObject);
						}
					}
				}

				newDTO[field] = newValue;
			} else if (typeof value === 'number') {
				const newValue = this.idToObject(value, entityCtor);

				newDTO[field] = newValue;
			} else {
				log.error(
					'Impossible to fill object',
					item,
					'for field',
					field,
					'and value',
					value
				);
			}
		}

		return newDTO as DTO;
	}

	/**
	 * Lets you create a list of new entities in the datasource
	 *
	 * @param items The entities to create
	 * @returns The created entities
	 */
	createAll(items: T[]) {
		for (const item of items) {
			this.create(item);
		}

		log.debug('CrudRepository: Added list', items, 'to datasource');

		return items.map((item) => this.fillIds(item));
	}

	/**
	 * Lets you create a new entity in the datasource
	 *
	 * @param item The entity to create
	 * @returns The created entity
	 */
	create(item: T) {
		let id;
		do {
			// id = Math.floor(Math.random() * 100000);
			id = ++this.lastUsedID;
		} while (this.dataSource.has(id));

		item.id = id;

		log.debug('CrudRepository: Adding', item, 'to datasource');

		this.dataSource.set(id, item);

		return this.fillIds(item);
	}

	/**
	 * Retrieves an entity from the datasource
	 *
	 * @param id The id of the entity to retrieve
	 * @returns The entity
	 */
	read(id: number): T | undefined {
		log.debug(`CrudRepository: Reading for dataSource`, this.dataSource);
		const object = this.dataSource.get(id);

		if (!object) {
			return undefined;
		}

		return { ...(this.fillIds(object) as T) };
	}

	/**
	 * Updates an entity with new values
	 *
	 * @param id The id of the entity
	 * @param item The new values for the entity
	 * @returns The updated entity
	 */
	update(id: number, item: T) {
		if (!this.dataSource.has(id)) {
			return this.create(item);
		}

		let updated = item;
		const curr = this.dataSource.get(id);

		if (curr != null) {
			updated = { ...curr, ...item };
		}

		log.debug('Updated:', updated);

		updated.id = id;

		this.dataSource.set(id, updated);

		return this.fillIds(updated);
	}

	/**
	 * Deletes an entity from the datasource given its id
	 *
	 * @param id The id of the entity to delete
	 * @returns true if the entity was deleted, false if it wasn't found
	 */
	delete(id: number) {
		return this.dataSource.delete(id);
	}

	/**
	 * Lists all the entries in the datasource
	 *
	 * @returns The list of entities in the datasource
	 */
	list(filter?: (e: T) => boolean) {
		log.debug('Reading list from dataSource', this.dataSource);
		if (filter) {
			return Array.from(this.dataSource.values())
				.filter((e) => filter(e))
				.map((e) => this.fillIds(e));
		} else {
			return Array.from(this.dataSource.values()).map((e) => this.fillIds(e));
		}
	}
}
