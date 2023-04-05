/*
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 28/09/2021 at 10:11
 * File src/controller
 *
 * @author sofiakb
 */

import { each, keys } from 'lodash';

import ModelAttribute from './model-attribute';
import Api from '../api';
import { clone, defined, renameKey } from '../utils';
import date from '../utils/date';
import { toJSON } from '../utils/to-json';
import { ClassConstructor, ControllerAttributes, GenericModelAttributes } from '../types/controller';
import { HttpApiError, HttpOptions } from '../types/api';

export class HttpApi<T extends GenericModelAttributes> {
	model: ClassConstructor<T>;
	api: Api;
	modelObject: T;
	table: string;

	constructor(attributes: ControllerAttributes) {
		this.api = new attributes.api();
		this.model = attributes.model;
		this.modelObject = new this.model();
		this.table = this.modelObject.table;
	}

	casting(data: Record<string, unknown>): T | null {
		return this.model && data ? new this.model(data) : null;
	}

	exec(
		method: string,
		callback: () => Promise<T[] | T | Record<string, unknown> | HttpApiError>,
	): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return new Promise((resolve, reject) => {
			if (!this.modelObject.isMethodAllowed(method))
				return reject(<HttpApiError>{ message: `Method [${method}] not allowed`, status: 400 });

			return callback()
				.then((response) => resolve(response))
				.catch((error) => reject(error));
		});
	}

	all(options: HttpOptions = {}): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return this.exec(
			'all',
			() =>
				new Promise((resolve, reject) => {
					this.api
						.fetch(`/${this.table}`, options)
						.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
						.catch((error: unknown) => reject(error));
				}),
		);
	}

	get(url: string, options: HttpOptions = {}): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return new Promise((resolve, reject) => {
			this.api
				.get(`/${this.table}/${url}`, options)
				.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
				.catch((error: unknown) => reject(error));
		});
	}

	post(
		url: string,
		data?: Record<string, unknown>,
		options: HttpOptions = {},
	): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return new Promise((resolve, reject) => {
			this.api
				.post(`/${this.table}/${url}`, toJSON(this.__data(data)), options)
				.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
				.catch((error: unknown) => reject(error));
		});
	}

	put(url: string, data?: Record<string, unknown>, options: HttpOptions = {}) {
		return new Promise((resolve, reject) => {
			this.api
				.put(`/${this.table}/${url}`, toJSON(this.__data(data)), options)
				.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
				.catch((error: unknown) => reject(error));
		});
	}

	delete(url: string, options: HttpOptions = {}) {
		return new Promise((resolve, reject) => {
			this.api
				.delete(`/${this.table}/${url}`, options)
				.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
				.catch((error: unknown) => reject(error));
		});
	}

	fetchBy(
		parameter: string | number,
		options: HttpOptions = {},
	): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return this.exec(
			'fetchBy',
			() =>
				new Promise((resolve, reject) => {
					this.api
						.fetchBy(`/${this.table}`, parameter, options)
						.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
						.catch((error: unknown) => reject(error));
				}),
		);
	}

	mine(options: HttpOptions = {}): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return this.exec('mine', () => new Promise(() => this.fetchBy('mine', options)));
	}

	store(
		data?: Record<string, unknown>,
		options: HttpOptions = {},
	): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return this.exec(
			'store',
			() =>
				new Promise((resolve, reject) => {
					this.api
						.create(`/${this.table}`, toJSON(this.__data(data)), options)
						.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
						.catch((error: unknown) => reject(error));
				}),
		);
	}

	search(payload: string, options: HttpOptions = {}): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return this.exec(
			'search',
			() =>
				new Promise((resolve, reject) => {
					this.api
						.search(`/${this.table}/search`, { payload }, options)
						.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
						.catch((error: unknown) => reject(error));
				}),
		);
	}

	update(id?: string | number, data?: Record<string, unknown>, options: HttpOptions = {}) {
		return this.exec(
			'update',
			() =>
				new Promise((resolve, reject) => {
					this.api
						.update(`/${this.table}`, this.__id(id), toJSON(this.__data(data)), options)
						.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
						.catch((error: unknown) => reject(error));
				}),
		);
	}

	destroy(id?: string | number, options: HttpOptions = {}) {
		return this.exec(
			'destroy',
			() =>
				new Promise((resolve, reject) => {
					this.api
						.destroy(`/${this.table}`, this.__id(id), options)
						.then((values: unknown) => resolve(this.setAttributes(values, !(options?.cast === false))))
						.catch((error: unknown) => reject(error));
				}),
		);
	}

	paginate(
		page = 1,
		limit = 18,
		url = '/',
		options: HttpOptions = {},
	): Promise<T[] | T | Record<string, unknown> | HttpApiError> {
		return this.exec(
			'paginate',
			() =>
				new Promise((resolve, reject) => {
					this.api
						.paginate(`/${this.table}${url}`, page, limit, options)
						.then((values: any) => {
							const items = values.data,
								result = values;
							result.data = this.setAttributes(items, !(options?.cast === false));
							// @ts-ignore
							return resolve(result);
						})
						.catch((error: unknown) => reject(error));
				}),
		);
	}

	setAttributes(values: unknown | Record<string, unknown>, cast = true): T[] | T | Record<string, unknown> {
		return (
			(cast
				? Array.isArray(values)
					? (values.map((item) => this.casting(item)) as T[])
					: (this.casting(values as Record<string, unknown>) as T)
				: (values as Record<string, unknown>)) ?? []
		);
	}

	__data(data?: Record<string, unknown> | T) {
		data = data as T;
		if (!data) return {};
		if (!!data && data.__original) {
			const original = data.__original,
				dataParameter = data;

			data = clone(data);

			each(keys(data), (key) => {
				if (defined(data?.casts) && defined(data?.casts[key]) && data?.casts[key] === 'date') {
					// @ts-ignore
					data[key] = date.moment(data[key]);
				}

				if (typeof original[key] === 'undefined') {
					// @ts-ignore
					delete data[key];
				} else {
					const modelAttribute = ModelAttribute.findByProp(dataParameter.attributes, key);

					if (modelAttribute === null || !modelAttribute.isFillable()) {
						// @ts-ignore
						delete data[key];
					} else data = renameKey(data, key, modelAttribute.getProp());
				}
			});
		}
		return data;
	}

	__id(id?: string | number) {
		// @ts-ignore
		return id ?? this[this.modelObject.columnID];
	}
}
