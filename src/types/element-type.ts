'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 10/01/2022 at 10:45
 * File src/utils/element-type
 */

export function stringLiterals<T extends string>(...args: T[]): T[] {
	return args;
}

export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
	? ElementType
	: never;
