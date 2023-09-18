'use strict';

/*
 * resto
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 01/09/2022 at 11:59
 * File src/utils/number
 */

export default class XNumber {
	static twoDigits = (number: string | number) =>
		typeof number === 'string'
			? parseInt(number) < 10
				? `0${parseInt(number)}`
				: parseInt(number)
			: number < 10
			? `0${number}`
			: number;

	static pretty = (x?: string | number, separator = ' ') =>
		x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator) ?? '?';
}
