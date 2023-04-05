'use strict';

/*
 * @sofiakb/vue
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 03/06/2022 at 16:51
 * File src/model
 */

import { each, filter, includes, map, uniq } from 'lodash';
import moment from 'moment';
import ModelAttribute from './model-attribute';
import { defined, jsonParse } from '../utils';
import date from '../utils/date';
import { HttpApiError } from '../types/api';

const pluralize = require('pluralize');

interface ModelAttributes {
	table?: string;
	pluralize?: boolean;
	appends?: unknown[];
	casts?: Record<string, string | ((value: unknown) => unknown)>;
	columnID?: string;
	dateFormat?: string;

	except?: string[];
	only?: string[];
	fillable?: string[];
	attributes: ModelAttribute[];

	__original?: any;
}

export default class Model {
	readonly #appends: unknown[];
	readonly #casts: Record<string, string | ((value: unknown) => unknown)>;
	readonly #columnID: string = 'id';
	readonly #dateFormat: string = 'DD/MM/YYYY HH:mm:ss';

	readonly #except: string[];
	readonly #only: string[];
	readonly #fillable: string[] = [];
	readonly #attributes: ModelAttribute[];

	#__original?: any;

	readonly #table: string;

	constructor(options: ModelAttributes) {
		this.#table = this.#__resolve.table(options.table ?? this.constructor.name, !(options.pluralize === false));

		this.#appends = options.appends ?? [];
		this.#attributes = options.attributes;
		this.#casts = options.casts ?? {};
		this.#columnID = options.columnID ?? 'id';
		this.#dateFormat = options.dateFormat ?? 'DD/MM/YYYY HH:mm:ss';
		this.#except = options.except ?? [];
		this.#only = options.only ?? [];

		this.#fillable = uniq(
			filter(this.#attributes, (attribute) => attribute.isFillable())
				.map((attribute) => attribute.getKey())
				.concat(map(this.#attributes, (attribute) => attribute.getProp())),
		);
	}

	isFillable(field: string) {
		return includes(this.#fillable, field);
	}

	isMethodAllowed(methodName: string): boolean {
		const _only = this._only(),
			_except = this._except();

		return defined(_only)
			? includes(_only, methodName)
			: _except.length > 0
			? !includes(_except, methodName)
			: true;
	}

	notAllowedMethodError(methodName: string) {
		return <HttpApiError>{ message: `Method [${methodName}] not allowed`, status: 400 };
	}

	_only() {
		return defined(this.#only) ? uniq(this.#only) : null;
	}

	_except() {
		return defined(this.#except) ? uniq(this.#except) : [];
	}

	_setAttribute(attribute: string, value: unknown) {
		// @ts-ignore
		this[attribute] = value;
	}

	__setItemAttributes(item: Record<string, unknown>) {
		if (!defined(item)) return item;

		const itemKeys = Object.keys(item);

		this.#__original = item;

		itemKeys.forEach((key: string) => {
			const modelKey: string | null = ModelAttribute.findByProp(this.#attributes, key)?.getKey() ?? null;

			if (modelKey && this.isFillable(modelKey)) {
				if (this.#casts && this.#casts[modelKey]) {
					const castTo = this.#casts[modelKey];

					if (typeof castTo === 'function') this._setAttribute(modelKey, castTo(item[key]));
					else
						switch (castTo) {
							case 'date': {
								this._setAttribute(
									modelKey,
									// @ts-ignore
									defined(item[key]) ? date.momentSql(item[key]) : item[key],
								);
								break;
							}
							case 'firebaseDate': {
								this._setAttribute(
									modelKey,
									defined(item[key])
										? // @ts-ignore
										  moment.unix(item[key]?._seconds ?? item[key]?.seconds ?? null)
										: item[key],
								);
								break;
							}
							case 'int': {
								// @ts-ignore
								this._setAttribute(modelKey, defined(item[key]) ? parseInt(item[key]) : item[key]);
								break;
							}
							case 'decimal': {
								// @ts-ignore
								this._setAttribute(modelKey, defined(item[key]) ? parseFloat(item[key]) : item[key]);
								break;
							}
							case 'boolean':
							case 'bool': {
								this._setAttribute(
									modelKey,
									defined(item[key]) ? item[key] === 'true' || item[key] === true : item[key],
								);
								break;
							}
							case 'json': {
								this._setAttribute(modelKey, defined(item[key]) ? jsonParse(item[key]) : item[key]);
								break;
							}
							default:
								break;
						}
				} else this._setAttribute(modelKey, item[key]);
			}
		});

		if (this.#appends) {
			// @ts-ignore
			each(this.#appends, (method, key) => this._setAttribute(key, this[method]()));
		}
	}

	#__resolve = {
		table: (name: string, plural = true) =>
			name !== '' && name !== '/' ? (plural ? pluralize(name, 2).toLowerCase() : name.toLowerCase()) : name,
	};

	get __original(): any {
		return this.#__original;
	}

	get attributes(): ModelAttribute[] {
		return this.#attributes;
	}

	get fillable(): string[] {
		return this.#fillable;
	}

	get appends(): unknown[] {
		return this.#appends;
	}

	get casts(): Record<string, string | ((value: unknown) => unknown)> {
		return this.#casts;
	}

	get columnID(): string {
		return this.#columnID;
	}

	get dateFormat(): string {
		return this.#dateFormat;
	}

	get except(): string[] | undefined {
		return this.#except;
	}

	get only(): string[] | undefined {
		return this.#only;
	}

	get table(): string {
		return this.#table;
	}
}
