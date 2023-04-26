import { Client, Ingredient, Order, Pizza } from '../model';
import { repositoriesList } from '../repositories/crudRepository';

export function loadFakeData() {
	repositoriesList.get(Ingredient)?.createAll([
		{
			name: 'Sauce Tomate',
		},
		{
			name: 'Fromage',
		},
		{
			name: 'Chorizo',
		},
		{
			name: 'Poivrons',
		},
		{
			name: 'Jambon',
		},
		{
			name: 'Champignons',
		},
		{
			name: 'Boeuf Haché',
		},
		{
			name: 'Origan',
		},
		{
			name: 'Olives',
		},
	]);

	repositoriesList.get(Pizza)?.createAll([
		{
			name: 'Pizza Chorizo',
			description: 'La meilleure des pizzas',
			price: 12.5,
			ingredients: [1, 2, 3, 4, 8, 9],
		},
		{
			name: 'Pizza Reine',
			description: 'Uniquement pour les princesses',
			price: 13,
			ingredients: [1, 2, 5, 6, 8, 9],
		},
		{
			name: 'Pizza Arménienne',
			description: 'Pour les amoureux de viande',
			price: 13.5,
			ingredients: [1, 2, 7, 8, 9],
		},
		{
			name: 'Pizza Marguerite',
			description: 'Le choix économique',
			price: 9,
			ingredients: [1, 2, 8, 9],
		},
	]);

	repositoriesList.get(Client)?.create({
		name: 'Timmy',
		lastname: 'Daumas',
		address: 'Quelque part',
	});

	repositoriesList.get(Order)?.create({
		pizzas: [1, 2],
		client: 1,
	});
}
