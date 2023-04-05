'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 07/06/2022 at 09:28
 * File src/model-attribute
 */

import { filter } from 'lodash';

export default class ModelAttribute {
	#key: string;
	#prop: string;
	#comment: string | null;
	#fillable = true;
	#readOnly = false;

	constructor(key: string, prop?: string) {
		this.#key = key;
		this.#prop = prop ?? key;
	}

	static create(key: string, prop?: string) {
		return new ModelAttribute(key, prop);
	}

	static findByProp(attributes: ModelAttribute[], prop: string) {
		return filter(attributes, (attribute) => attribute.getProp() === prop)[0] ?? null;
	}

	isFillable() {
		return this.#fillable;
	}

	getKey(): string {
		return this.#key;
	}

	key(value: string) {
		this.#key = value;
		return this;
	}

	getProp(): string {
		return this.#prop;
	}

	prop(value: string) {
		this.#prop = value;
		return this;
	}

	getComment(): string | null {
		return this.#comment;
	}

	comment(value: string | null) {
		this.#comment = value;
		return this;
	}

	getFillable(): boolean {
		return this.#fillable;
	}

	fillable(value: boolean) {
		this.#fillable = value;
		return this;
	}

	getReadOnly(): boolean {
		return this.#readOnly;
	}

	readOnly(value: boolean) {
		this.#readOnly = value;
		return this;
	}
}
