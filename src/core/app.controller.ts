'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 05/04/2023 at 11:12
 * File src/core/app.controller
 */

import AppService from './app.service';
import { GenericModelAttributes } from '../types/controller';

interface AppControllerProperties<T extends GenericModelAttributes> {
	service: AppService<T>;
}

/**
 * @class AppController
 */
export default class AppController<T extends GenericModelAttributes> {
	service: AppService<T>;

	/**
	 * @constructor AppController
	 *
	 * @param {AppControllerProperties} properties
	 */
	constructor(properties: AppControllerProperties<T>) {
		this.service = properties.service;
	}
}
