'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 10/01/2022 at 10:57
 * File src/types/methods-type
 */

import { ElementType } from './element-type';
import { methods } from './methods';

export type MethodsType = ElementType<typeof methods>;
