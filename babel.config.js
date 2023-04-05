"use strict";

/*
 * vue3-framework
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 07/09/2022 at 09:58
 * File /babel.config.js
 */

module.exports = {
	presets: [
		[ '@babel/preset-env', { targets: { node: 'current' } } ],
		'@babel/preset-typescript',
	],
};