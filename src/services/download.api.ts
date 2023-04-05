'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 13/12/2021 at 10:48
 * File src/services/download.service
 */

import axios, { AxiosResponse } from 'axios';
import Api from '../api';
import { toJSON } from '../utils/to-json';
import { HttpOptions } from '../types/api';

export default class DownloadApi extends Api {
	download(path: string, options: HttpOptions = {}): Promise<unknown> {
		options.headers = options.headers ?? <Headers>{};
		options.headers.set('Content-Type', 'application/json');

		return new Promise((resolve, reject) =>
			axios
				.post(`${this.server}/${path}`, options.data, {
					responseType: 'arraybuffer',
					headers: toJSON(options.headers),
				})
				.then((response: AxiosResponse) =>
					resolve(response && response.data && response.data.data ? response.data.data : response),
				)
				.catch((error: unknown) => reject(error)),
		);
	}

	post(url: string, data: Record<string, unknown>, options: HttpOptions = {}): Promise<unknown> {
		return this.download(url, { ...options, ...{ data } });
	}
}
