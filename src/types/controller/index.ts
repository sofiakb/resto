'use strict';

/*
 * resto
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 05/04/2023 at 10:56
 * File src/types/controller/index
 */

import Api from '../../api';
import ModelAttribute from '../../core/model-attribute';

export interface ControllerAttributes {
	api: ClassConstructor<Api>;
	model: ClassConstructor<any>;
}

export interface GenericModelAttributes {
	table: string;
	isMethodAllowed: (methodName: string) => boolean;
	__original?: any;
	casts?: any;
	attributes: ModelAttribute[];
	columnID: string;
}

export interface ClassConstructor<T> {
	new (attributes?: any): T;
}
