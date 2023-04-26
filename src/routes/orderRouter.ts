import { Router } from 'express';
import Joi from 'joi';
import { Order } from '../model';
import { OrderRepository } from '../repositories';
import { checkBodyFactory, crudRouterFactory } from './crudRouter';
import { searchRouterFactory } from './searchRouter';

const orderRepository = new OrderRepository();

const searchParams = new Map<string, keyof Order>();

searchParams.set('id', 'id');
searchParams.set('pizzas', 'pizzas');
searchParams.set('client', 'client');

const searchOrderRouter = searchRouterFactory(
	Router(),
	orderRepository,
	searchParams
);

const orderRouter = crudRouterFactory(
	searchOrderRouter,
	orderRepository,
	checkBodyFactory(
		Joi.object({
			pizzas: Joi.array().items(Joi.number().integer().required()).min(1),
			client: Joi.number().integer().required(),
		})
	)
);
export { orderRouter };
