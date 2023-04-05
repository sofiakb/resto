'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 05/04/2023 at 11:18
 * File tests/example/example.service
 */

import { AppService } from '../../src';
import Example from './example';
import { ExampleApi } from './example.api';

export default class ExampleService extends AppService<Example> {
	constructor() {
		super({ api: ExampleApi, model: Example });
	}

	get405() {
		return this.httpApi.get('405');
	}

	get404() {
		return this.httpApi.get('404');
	}

	get200(): Promise<Record<string, unknown>> {
		return this.httpApi.get('200', { cast: false }) as Promise<Record<string, unknown>>;
	}
}
