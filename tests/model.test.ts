'use strict';

/*
 * vue3-framework
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 07/09/2022 at 09:42
 * File tests/model.test
 */

import ExampleController from './example/example.controller';

// describe('model table', () => {
// 	test('pluralize table name', () => {
// 		const example = new Example();
// 		expect(example.table).toBe('examples');
// 	});
// });

describe('controller test', () => {
	test('test get method 405', async () => {
		const exampleController = new ExampleController();
		await exampleController.get405().catch((err) => {
			expect(err.status).toBe(405);
		});
	});

	test('test get method 404', async () => {
		const exampleController = new ExampleController();
		await exampleController.get404().catch((err) => {
			expect(err.status).toBe(404);
		});
	});

	test('test get method 200', async () => {
		const exampleController = new ExampleController();
		await exampleController.get200().then((res) => {
			expect(true).toBeTruthy();
		});
	});
});
