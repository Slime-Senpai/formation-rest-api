import { Router } from 'express';
import Joi from 'joi';
import { ClientRepository } from '../repositories';
import { checkBodyFactory, crudRouterFactory } from './crudRouter';

const clientRouter = crudRouterFactory(
	Router(),
	new ClientRepository(),
	checkBodyFactory(
		Joi.object({
			name: Joi.string().alphanum().min(3).max(30).required(),
			lastname: Joi.string().alphanum().min(3).max(30).required(),
			address: Joi.string().alphanum().min(3).max(100).required(),
		})
	)
);

export { clientRouter };
