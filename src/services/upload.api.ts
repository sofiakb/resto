'use strict';

/*
 * exudatain-manager-app
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 13/12/2021 at 10:48
 * File src/http/controllers/upload-controller
 */

import axios, { AxiosResponse } from 'axios';
import { toJSON } from '../utils/to-json';
import Api from '../api';
import { HttpOptions } from '../types/api';

export default class UploadApi extends Api {
	upload(path: string, options: any = {}): Promise<unknown> {
		options.headers = options.headers ?? <Headers>{};
		options.headers.set('Content-Type', 'multipart/form-data');
		return new Promise((resolve, reject) =>
			axios
				.post(`${this.server}/${path}`, options.data, {
					headers: toJSON(options.headers),
				})
				.then((response: AxiosResponse) =>
					resolve(response && response.data && response.data.data ? response.data.data : response),
				)
				.catch((error: unknown) => reject(error)),
		);
	}

	post(url: string, data: Record<string, unknown>, options: HttpOptions = {}): Promise<unknown> {
		return this.upload(url, { ...options, ...{ data } });
	}
}
