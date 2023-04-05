'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 05/04/2023 at 11:12
 * File src/core/app.controller
 */

import HttpService from './http.service';
import { GenericModelAttributes } from '../types/controller';

interface AppControllerProperties<T extends GenericModelAttributes> {
	service: HttpService<T>;
}

/**
 * @class HttpController
 */
export default class HttpController<T extends GenericModelAttributes> {
	service: HttpService<T>;

	/**
	 * @constructor AppController
	 *
	 * @param {AppControllerProperties} properties
	 */
	constructor(properties: AppControllerProperties<T>) {
		this.service = properties.service;
	}
}
