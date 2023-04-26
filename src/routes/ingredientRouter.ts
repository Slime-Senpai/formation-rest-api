import { Router } from 'express';
import Joi from 'joi';
import { IngredientRepository } from '../repositories';
import { checkBodyFactory, crudRouterFactory } from './crudRouter';

const ingredientRouter = crudRouterFactory(
	Router(),
	new IngredientRepository(),
	checkBodyFactory(
		Joi.object({
			name: Joi.string().alphanum().min(3).max(30).required(),
		})
	)
);

export { ingredientRouter };
