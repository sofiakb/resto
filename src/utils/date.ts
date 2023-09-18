'use strict';

/*
 * resto
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 01/09/2022 at 11:58
 * File src/utils/date
 */

import moment from 'moment-timezone';
import XNumber from './x-number';

export class DateFrom {
	when: string;
	duration: number;
	unit: string;

	constructor(when: string, duration: number, unit: string) {
		this.when = when;
		this.duration = duration;
		this.unit = unit;
	}

	static create(properties: { when: string; duration: number; unit: string }) {
		return new DateFrom(properties.when, properties.duration, properties.unit);
	}

	toString() {
		return `${this.when} ${this.duration.toFixed(0)} ${this.unit}`;
	}
}

export default class DateJs {
	constructor() {
		moment.locale('fr');
		moment.tz.setDefault('Europe/Paris');
	}

	static moment(date: string | null = null, format = 'YYYY/MM/DD') {
		moment.locale('fr');
		// moment.tz.setDefault('Europe/Paris');
		return date === null
			? moment().tz('Europe/Paris')
			: format
			? moment(date, format).tz('Europe/Paris')
			: moment(date).tz('Europe/Paris');
	}

	static momentSql(date: string | null = null, format = 'YYYY-MM-DD HH:mm:ss') {
		return this.moment(date, format);
	}

	static age(birthday: string | any, unit = true) {
		const year = this.moment().diff(this.moment(birthday), 'years');
		let month, week;
		return unit || year > 0
			? unit
				? `${year} an${Math.abs(year || 0) > 1 ? 's' : ''}`
				: year
			: (month = this.moment().diff(this.moment(birthday), 'month')) > 0
			? `${Math.abs(month)} mois`
			: `${(week = this.moment().diff(this.moment(birthday), 'week'))} semaine${Math.abs(week) > 1 ? 's' : ''}`;
	}

	static between(start: string | any, end: string | any, unit = true) {
		const year = this.moment(end).diff(this.moment(start), 'years');
		let month, week;
		return year > 0
			? `${year} an${Math.abs(year || 0) > 1 ? 's' : ''}`
			: (month = this.moment(end).diff(this.moment(start), 'month')) > 0
			? `${Math.abs(month)} mois`
			: `${(week = this.moment(end).diff(this.moment(start), 'week'))} semaine${Math.abs(week) > 1 ? 's' : ''}`;
	}

	static from(date: string | any): DateFrom {
		const now = this.moment(),
			compareDate = this.moment(date);
		const diff = this.diff(now, compareDate, false);
		const minutes = Math.abs(typeof diff === 'number' ? diff : 0),
			when = now >= compareDate ? 'il y a' : 'dans';
		let hours, duration, unit;
		if (minutes < 60) {
			duration = minutes;
			unit = 'minutes';
		} else if ((hours = minutes / 60) < 24) {
			duration = hours;
			unit = 'heures';
		} else {
			duration = hours / 24;
			unit = 'jours';
		}

		return DateFrom.create({ when, duration, unit });
	}

	static diff(start: any = null, end: any = null, format = true) {
		const minutes = this.moment(end).diff(this.moment(start), 'minutes');
		return start && end ? (format ? this.formatHoursAndMinutes(minutes / 60, minutes % 60) : minutes) : null;
	}

	static formatHoursAndMinutes(hours: string | number, minutes: string | number, separator = 'h') {
		return `${XNumber.twoDigits(hours)}${separator}${XNumber.twoDigits(minutes)}`;
	}

	static formatTime(date: any, separator = 'h') {
		return this.formatHoursAndMinutes(date.hours(), date.minutes(), separator);
	}
}
