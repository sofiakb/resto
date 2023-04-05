'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 05/04/2023 at 11:14
 * File src/core/app.service
 */

import { HttpApi } from './http-api';
import { ControllerAttributes, GenericModelAttributes } from '../types/controller';

/**
 * @class AppService
 */
export default class AppService<T extends GenericModelAttributes> {
	httpApi: HttpApi<T>;

	/**
	 * @constructor AppService
	 *
	 * @param {ControllerAttributes} properties
	 */
	constructor(properties?: ControllerAttributes) {
		this.httpApi = new HttpApi<T>(properties as ControllerAttributes);
	}
}
