'use strict';

/*
 * resto
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 05/04/2023 at 11:25
 * File tests/example/example.api
 */

import { Api } from '../../src';

export class ExampleApi extends Api {
	server = 'https://httpbin.org/status';
}
