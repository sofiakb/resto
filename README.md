[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[comment]: <> ([![LinkedIn][linkedin-shield]][linkedin-url])



<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h1 align="center">resto</h1>

  <p align="center">
      A typescript library for http API calls.
      <br />
      <!--<a href="https://github.com/sofiakb/resto"><strong>Explore the docs »</strong></a>-->
      <br />
      <br />
      <a href="https://github.com/sofiakb/resto/issues">Report Bug</a>
      ·
      <a href="https://github.com/sofiakb/resto/issues">Request Feature</a>
  </p>

</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the library</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Library

The library simplify API calls with axios library.

### Built With

* [Javascript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
* [Typescript](https://www.typescriptlang.org/)
* [Axios](https://axios-http.com/docs/intro)

<!-- GETTING STARTED -->

### Prerequisites

- axios
- typescript

### Installation

```shell
npm install --save @sofiakb/resto
```

<!-- USAGE EXAMPLES -->

## Usage

example.api.ts
```ts
import { Api } from "@sofiakb/resto";

export class ExampleApi extends Api {
	server = 'https://httpbin.org/status';
}
```

example.controller.ts
```ts
import { HttpController } from "@sofiakb/resto";
import Example from './example';
import ExampleService from './example.service';

export default class ExampleController extends HttpController<Example> {
	service: ExampleService;

	constructor() {
		super({ service: new ExampleService() });
	}

	get405() {
		return this.service.get405();
	}

	get404() {
		return this.service.get404();
	}

	get200() {
		return this.service.get200();
	}
}
```

example.service.ts
```ts
import { HttpService } from "@sofiakb/resto";
import Example from './example';
import { ExampleApi } from './example.api';

export default class ExampleService extends HttpService<Example> {
	constructor() {
		super({ api: ExampleApi, model: Example });
	}

	get405() {
		return this.httpApi.get('405');
	}

	get404() {
		return this.httpApi.get('404');
	}

	get200(): Promise<Record<string, unknown>> {
		return this.httpApi.get('200', { cast: false }) as Promise<Record<string, unknown>>;
	}
}
```

example.ts
```ts
import { Model, ModelAttribute } from "@sofiakb/resto";

export default class Example extends Model {
	id: string;

	static icon = {
		name: 'test',
		type: 'la',
	};

	constructor(attributes?: any) {
		super({
			attributes: [ModelAttribute.create('id')],
			casts: {
				created: 'date',
				updated: 'date',
			},
			table: '/',
		});
		this.__setItemAttributes(attributes);
	}

	static create(properties?: any) {
		return new Example(properties);
	}
}
```

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/sofiakb/resto/issues) for a list of proposed features (and known issues).


<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/sofiakb/resto.svg?style=for-the-badge

[contributors-url]: https://github.com/sofiakb/resto/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/sofiakb/resto.svg?style=for-the-badge

[forks-url]: https://github.com/sofiakb/resto/network/members

[stars-shield]: https://img.shields.io/github/stars/sofiakb/resto.svg?style=for-the-badge

[stars-url]: https://github.com/sofiakb/resto/stargazers

[issues-shield]: https://img.shields.io/github/issues/sofiakb/resto.svg?style=for-the-badge

[issues-url]: https://github.com/sofiakb/resto/issues

[license-shield]: https://img.shields.io/github/license/sofiakb/resto.svg?style=for-the-badge

[license-url]: https://github.com/sofiakb/resto/blob/main/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-url]: https://www.linkedin.com/in/sofiane-akbly/