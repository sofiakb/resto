'use strict';

/*
 * cloud-functions
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 04/01/2023 at 11:43
 * File functions/src/utils/to-json
 */

import { map } from 'lodash';

export const toJSON = (object: any): any => {
	if (Array.isArray(object)) {
		return map(object, (item) => (typeof item === 'object' ? toJSON(item) : item));
	}
	try {
		return JSON.parse(typeof object === 'string' ? object : JSON.stringify({ ...object }));
	} catch (e) {
		return object;
	}
};
