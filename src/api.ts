'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 10/01/2022 at 10:11
 * File src/api
 */

import { forEach, includes } from 'lodash';

import { methods as xMethods } from './types/methods';
import { MethodsType } from './types/methods-type';
import { HttpConfig } from './types/http-config';
import { toJSON } from './utils/to-json';
import { __options, urlCleanup } from './utils';
import Nullable from './types/nullable';
import { __createError, ApiAttributes, HttpOptions, HttpResponse } from './types/api';

export default class Api {
	/**
	 * @type {?string}
	 */
	server: string | null = null;

	/**
	 * @type {?string}
	 */
	tokenName: string | null = null;

	/**
	 * @type {?string[]}
	 */
	methods: string[] = xMethods;

	/**
	 * @type {?string}
	 */
	PREFIX = '';

	constructor(attributes: ApiAttributes) {
		forEach(attributes, (value: any, attribute: string) => {
			if (this.hasOwnProperty(attribute) || attribute in this) {
				// @ts-ignore
				this[attribute] = value;
			}
		});
	}

	config(method: MethodsType, url: string, options: HttpOptions | null = {}) {
		if (this.server === null || this.server.trim() === '') throw new Error('API endpoint required');

		if (!includes(this.methods, method)) throw new Error(`Unknown method : ${method}`);

		const requestInfo: HttpConfig = {
			method: method,
			url: urlCleanup(`${this.server}/${this.PREFIX}/${url}`),
			headers: <Headers>{},
			data: {},
		};

		if (options) {
			/*Object.keys(options).forEach((key) =>
				key === 'data' || key === 'headers'
					? false
					: ((requestInfo.data ?? {})[key] = options[key as keyof HttpOptions]),
			);*/
			if (options.data) {
				requestInfo.data = {
					...requestInfo.data,
					...(options.file === true || options.withoutObject === true
						? options.data
						: { data: options.data }),
				};
			}
		}

		requestInfo.headers = this.__configHeaders(options);
		return requestInfo;
	}

	request(method: MethodsType, url: string, options: HttpOptions | null = {}) {
		this.withServer().withTokenName();

		return new Promise((resolve, reject) => {
			if (!!options?.loading)
				options.loading(typeof options.withLoading === 'undefined' ? true : options.withLoading);

			const config = this.config(method, url, options);

			options = !!options ? __options(options) : null;

			fetch(config.url, {
				...config,
				body: !!config.data && Object.keys(config.data).length > 0 ? JSON.stringify(config.data) : null,
			})
				.then(async (response) => {
					return response?.ok === true
						? resolve(await this.__response(response))
						: reject(
								__createError({
									status: response.status,
									statusText: response.statusText,
									data: toJSON(await response.text()),
								}),
						  );
				})
				.finally(() => (!!options?.loading ? options.loading(false) : true));
		});
	}

	withServer(server?: Nullable<string>) {
		this.server = this.server ?? server ?? process.env.API_SERVER ?? null;
		return this;
	}

	withTokenName(tokenName?: Nullable<string>) {
		this.tokenName = this.server ?? tokenName ?? process.env.TOKEN_NAME ?? null;
		return this;
	}

	get(url: string, options: HttpOptions = {}) {
		return this.request('GET', url, options);
	}

	fetch(url: string, options: HttpOptions = {}) {
		return this.get(url, options);
	}

	fetchBy(url: string, parameter: any, options: HttpOptions = {}) {
		return this.fetch(`${url}/${parameter}`, options);
	}

	post(url: string, data: Record<string, unknown>, options: HttpOptions = {}) {
		return this.request('POST', url, { ...options, ...{ data } });
	}

	create(url: string, data: Record<string, unknown>, options: HttpOptions = {}) {
		return this.post(url, data, options);
	}

	put(url: string, data: Record<string, unknown>, options: HttpOptions = {}) {
		return this.request('PUT', `${url}`, { ...options, ...{ data } });
	}

	update(url: string, id: number | any, data: Record<string, unknown>, options: HttpOptions = {}) {
		return this.put(`${url}/${id}`, data, options);
	}

	delete(url: string, options: HttpOptions = {}) {
		return this.request('DELETE', `${url}`, options);
	}

	destroy(url: string, id: number | any, options: HttpOptions = {}) {
		return this.delete(`${url}/${id}`, options);
	}

	search(url: string, data: Record<string, unknown>, options: HttpOptions = {}) {
		return this.request('POST', url, { ...options, ...{ data } });
	}

	paginate(url: string, page = 0, limit = 18, options: HttpOptions = {}) {
		return this.request('GET', `${url}?page=${page}&limit=${limit}`, options);
	}

	async __response(response: Response) {
		try {
			const res = await response.json();
			return res.data?.data ?? res?.data ?? response;
		} catch (e) {
			return null;
		}
	}

	__configHeaders(options: HttpOptions | null = {}) {
		const headers: Headers = new Headers(options?.headers ?? {});

		if (!headers.has('Content-Type')) headers.append('Content-Type', 'application/json');
		if (!!options?.token) headers.set('Authorization', `Bearer ${options.token}`);

		return headers;
	}
}
