/*
 * nuxt3-http
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 28/09/2021 at 10:11
 * File src/modules/example/example.controller
 */

import { HttpController } from '../../src';
import Example from './example';
import ExampleService from './example.service';

export default class ExampleController extends HttpController<Example> {
	service: ExampleService;

	constructor() {
		super({ service: new ExampleService() });
	}

	get405() {
		return this.service.get405();
	}

	get404() {
		return this.service.get404();
	}

	get200() {
		return this.service.get200();
	}
}
