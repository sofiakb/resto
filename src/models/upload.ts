'use strict';

/*
 * nuxt3-http
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 13/12/2021 at 09:46
 * File src/models/upload
 */

import { each } from 'lodash';
import UploadApi from "../services/upload.api";

class Upload {
	data;
	object;
	config;

	constructor(data: any, object: any, keys: string[], config: any) {
		this.object = object;
		this.data = new FormData();
		each(keys || [], (key) => this.prepare(key));
		this.data.append('upload', JSON.stringify(this.object));
		this.config = config;
	}

	prepare(field: string) {
		if (!(typeof this.object[field] == 'undefined')) this.data.append(field, this.object[field]);
	}

	send(url: string, options: any = {}) {
		const controller = new UploadApi({ ...this.config, ...options.controller?.attributes });
		return controller.send(url, this.data, options);
	}
}

export default Upload;
