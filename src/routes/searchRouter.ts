import { Router } from 'express';
import { Entity } from '../model';
import { CrudRepository } from '../repositories';
import { log } from '../utils';

/**
 * Lets you create a router which has some basic crud routes already in place
 *
 * @param repository The Repository to use for the Entity
 * @param checkBody The function to use to check the body for the Entity
 * @returns The router with a GET, POST, PUT, PATCH and DELETE made for the basic routes
 */
function searchRouterFactory<T extends Entity>(
	router: Router,
	repository: CrudRepository<T>,
	fieldsToSearchBy: Map<string, keyof T>
) {
	function checkEquals(
		valueFromObject: T[keyof T],
		valueFromSearch: any | any[]
	) {
		if (
			(Array.isArray(valueFromObject) &&
				valueFromObject.length > 0 &&
				typeof valueFromObject[0] === 'number') ||
			typeof valueFromObject === 'number'
		) {
			if (Array.isArray(valueFromSearch)) {
				valueFromSearch = valueFromSearch.map((e) => +e);
			} else {
				valueFromSearch = +valueFromSearch;
			}
		}

		if (
			(Array.isArray(valueFromObject) &&
				valueFromObject.length > 0 &&
				typeof valueFromObject[0] === 'boolean') ||
			typeof valueFromObject === 'boolean'
		) {
			if (Array.isArray(valueFromSearch)) {
				valueFromSearch = valueFromSearch.map((e) => !!e);
			} else {
				valueFromSearch = !!valueFromSearch;
			}
		}

		log.debug('obj', valueFromObject, 'search', valueFromSearch);

		if (Array.isArray(valueFromObject)) {
			if (Array.isArray(valueFromSearch)) {
				return valueFromSearch.every((s) => valueFromObject.includes(s));
			} else {
				return valueFromObject.includes(valueFromSearch);
			}
		} else {
			if (Array.isArray(valueFromSearch)) {
				if (typeof valueFromObject === 'string') {
					return valueFromSearch.some((s) => valueFromObject.includes(s));
				}
				return valueFromSearch.some((s) => s === valueFromObject);
			} else {
				if (typeof valueFromObject === 'string') {
					return valueFromObject.includes(valueFromSearch);
				}
				return valueFromSearch == valueFromObject;
			}
		}
	}

	router.get('/search', (req, res) => {
		const foundFields = new Map<keyof T, string | string[]>();

		for (const [searchParam, searchField] of fieldsToSearchBy) {
			if (req.query[searchParam]) {
				foundFields.set(
					searchField,
					req.query[searchParam] as string | string[]
				);
			}
		}

		const filterFunc = (value: T) => {
			for (const [field, values] of foundFields) {
				if (!checkEquals(value[field], values)) {
					return false;
				}
			}

			return true;
		};

		let list = repository.list(filterFunc) as T[];

		res.json(list);
	});

	return router;
}

export { searchRouterFactory };
