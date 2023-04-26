import { Entity } from '../model/entity';

const dataSources = new Map<{ new (): Entity }, Map<number, any>>();

const dataSourceFactory = {
	// TODO Fix the any here :/
	getDataSource<T extends Entity>(ctor: { new (): T }): Map<number, T> {
		const dataSource = dataSources.get(ctor);
		if (dataSource) {
			return dataSource;
		}

		const newDataSource = new Map();

		dataSources.set(ctor, newDataSource);

		return newDataSource;
	},
};

export { dataSourceFactory };
