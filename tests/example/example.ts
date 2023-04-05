/*
 * nuxt3-http
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 28/09/2021 at 10:11
 * File src/modules/example/example
 */

import { Model, ModelAttribute } from '../../src/';

export default class Example extends Model {
	id: string;

	static icon = {
		name: 'test',
		type: 'la',
	};

	constructor(attributes?: any) {
		super({
			attributes: [ModelAttribute.create('id')],
			casts: {
				created: 'date',
				updated: 'date',
			},
			table: '/',
		});
		this.__setItemAttributes(attributes);
	}

	static create(properties?: any) {
		return new Example(properties);
	}
}
