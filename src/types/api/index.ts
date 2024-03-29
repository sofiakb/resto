'use strict';

/*
 * resto
 *
 * (c) Sofiane Akbly <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 05/04/2023 at 10:59
 * File src/types/api/index
 */

export interface HttpApiError {
	message: string;
	status: number;
	code: number | string;
}

export interface HttpResponse {
	status: number;
	statusText: string | null;
	data: Record<string, unknown>;
}

export const __createError = (error: HttpResponse | null): HttpApiError =>
	<HttpApiError>{
		message: error?.data?.error ?? 'Une erreur est survenue, merci de réessayer plus tard.',
		status: parseInt((error?.status ?? 500).toString()),
		code: error?.data?.code ?? error?.status ?? 500,
	};

export interface HttpOptions {
	file?: boolean;
	data?: Record<string, unknown> | unknown;
	headers?: Headers;
	withoutObject?: boolean;
	loading?: (value: unknown) => void;
	withLoading?: boolean;
	token?: string;
	cast?: boolean;
}

export type ApiAttributes = {
	/**
	 * @type {?string}
	 */
	server: string | null;

	/**
	 * @type {?string[]}
	 */
	methods?: string[];

	/**
	 * @type {?string}
	 */
	PREFIX?: string;
};
