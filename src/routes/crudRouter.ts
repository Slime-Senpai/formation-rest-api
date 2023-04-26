import { NextFunction, Request, Response, Router } from 'express';
import { ObjectSchema } from 'joi';
import { Entity } from '../model';
import { CrudRepository } from '../repositories';
import { checkId } from '../utils';

/**
 * Lets you control if a body is well made for a given Entity
 *
 * @param constructor The constructor used to create a new instance of the Entity
 * @returns Bad Request if the body is not correct
 */
function checkBodyFactory(joiSchema: ObjectSchema) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (Array.isArray(req.body)) {
				const body = [];
				for (const elem of req.body) {
					body.push(await joiSchema.validateAsync(elem));
				}
				req.body = body;
				next();
			} else {
				const body = await joiSchema.validateAsync(req.body);
				req.body = body;
				next();
			}
		} catch (err: any) {
			return res.status(400).json(err);
		}
	};
}

/**
 * Lets you create a router which has some basic crud routes already in place
 *
 * @param repository The Repository to use for the Entity
 * @param checkBody The function to use to check the body for the Entity
 * @returns The router with a GET, POST, PUT, PATCH and DELETE made for the basic routes
 */
function crudRouterFactory<T extends Entity>(
	crudRouter: Router,
	repository: CrudRepository<T>,
	checkBody: (req: Request, res: Response, next: NextFunction) => any
) {
	crudRouter.get('/', (req, res) => {
		res.json(repository.list());
	});

	crudRouter.get('/:id', checkId, (req, res) => {
		const entity = repository.read(+req.params.id);

		if (!entity) {
			return res.status(404).json();
		}

		res.json(entity);
	});

	crudRouter.post('/', checkBody, (req, res) => {
		if (Array.isArray(req.body)) {
			res.json(repository.createAll(req.body));
		} else {
			res.json(repository.create(req.body));
		}
	});

	crudRouter.put('/:id', checkId, checkBody, (req, res) => {
		res.json(repository.update(+req.params.id, req.body));
	});

	crudRouter.patch('/:id', checkId, checkBody, (req, res) => {
		res.json(repository.update(+req.params.id, req.body));
	});

	crudRouter.delete('/:id', checkId, (req, res) => {
		const deleted = repository.delete(+req.params.id);

		if (!deleted) {
			return res.status(404).json();
		}

		res.status(204).json();
	});

	return crudRouter;
}

export { checkBodyFactory, crudRouterFactory };
