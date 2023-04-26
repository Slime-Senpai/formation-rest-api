import { Router } from 'express';
import Joi from 'joi';
import { Pizza } from '../model';
import { PizzaRepository } from '../repositories';
import { checkId } from '../utils';
import { checkBodyFactory, crudRouterFactory } from './crudRouter';
import { searchRouterFactory } from './searchRouter';

const repository = new PizzaRepository();

const searchParams = new Map<string, keyof Pizza>();

searchParams.set('name', 'name');
searchParams.set('ingredients', 'ingredients');
searchParams.set('description', 'description');
searchParams.set('price', 'price');

const searchPizzaRouter = searchRouterFactory(
	Router(),
	repository,
	searchParams
);

const pizzaRouter = crudRouterFactory(
	searchPizzaRouter,
	repository,
	checkBodyFactory(
		Joi.object({
			name: Joi.string().alphanum().min(3).max(30).required(),
			description: Joi.string().alphanum().min(3).max(100).required(),
			price: Joi.number().min(0).max(100).required(),
			ingredients: Joi.array().items(Joi.number().integer().required()).min(1),
		})
	)
);

pizzaRouter.post('/:id/like', checkId, (req, res) => {
	const id = +req.params.id;
	const currentPizza = repository.read(id);

	if (!currentPizza) {
		return res.status(404).json();
	}

	res.json(repository.update(id, { likes: ++currentPizza.likes }));
});

export { pizzaRouter };
