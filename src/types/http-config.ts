'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 10/01/2022 at 10:52
 * File src/types/axios-config
 */

import { MethodsType } from './methods-type';

export type HttpConfig = {
	method: MethodsType;
	url: string;
	headers: Headers;
	data?: Record<string, unknown>;
};
