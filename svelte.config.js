import sveltePreprocess from 'svelte-preprocess';
import { replace } from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import adapter from '@sveltejs/adapter-static';
import path from 'path';
/** @type {import('@sveltejs/kit').Config} */

const production = process.env.NODE_ENV !== 'development';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		//ssr: false,
		vite: {
			server: {
				cors: {
					origin: ['localhost:3000'],
					methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
					preflightContinue: false,
					optionsSuccessStatus: 204
				}
			},
			plugins: [
				{
					name: 'configure-server',
					configureServer(server) {
						server.middlewares.use((_req, res, next) => {
							res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
							res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
							next();
						});
					}
				}
			],
			resolve: {
				alias: {
					$src: path.resolve('./src')
				}
			},
			optimizeDeps: {
				//include: ['chess'],
			},
			ssr: {
				//noExternal: ['chess'],
			}
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		})
	},
	preprocess: sveltePreprocess({
		sourceMap: !production,
		babel: {
			presets: [
				[
					'@babel/preset-env',
					{
						loose: true,
						// No need for babel to resolve modules
						modules: false,
						targets: {
							// ! Very important. Target es6+
							esmodules: true
						}
					}
				]
			]
		},
		postcss: {
			plugins: [autoprefixer()]
		},
		stylus: {
			prependData: `@require 'src/styles/variables'`
		}
	})
};

export default config;
