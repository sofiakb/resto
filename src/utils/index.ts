'use strict';

import moment from 'moment';
import { HttpOptions } from '../types/api';

/*
 * resto
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 04/04/2023 at 16:41
 * File src/utils/index
 */

const isObject = (val: any) => val instanceof Object;
const isMoment = (val: any) => val instanceof moment;

export const urlCleanup = (url: string) =>
	url
		.replace(RegExp(/\/{2,}/g), '/')
		.replace('http:/', 'http://')
		.replace('https:/', 'https://');

const parseDates = (data: any) => {
	Object.keys(data).map((key) => {
		if (isObject(data[key])) parseDates(data[key]);

		if (isMoment(data[key])) data[key] = data[key].format('YYYY-MM-DD HH:mm:ss');
	});
	return data;
};

export const __options = (options: HttpOptions) => {
	if (options.data) options.data = parseDates(options.data);
	if (!options.headers) options.headers = {} as Headers;
	if (process.env.API_KEY) options.headers.set('X-API-KEY', process.env.API_KEY);

	return options;
};

export const jsonParse = (text: any) => {
	if ((Array.isArray(text) || text instanceof Object) && !(text instanceof String)) return text;

	try {
		return /^[\],:{}\s]*$/.test(
			text
				.replace(/\\["\\\/bfnrtu]/g, '@')
				.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
				.replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
		)
			? JSON.parse(text)
			: null;
	} catch (e) {
		return null;
	}
};

export const renameKey = function (object: any, old: string, key: string) {
	if (old !== key) {
		Object.defineProperty(object, key, Object.getOwnPropertyDescriptor(object, old) || '');
		delete object[old];
	}
	return object;
};

export const clone = (object: any) => jsonParse(JSON.stringify(object));

export const defined = (value: any, strict = true): boolean =>
	typeof value !== 'undefined' && (strict ? value !== null : true);
