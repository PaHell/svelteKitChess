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
			resolve: {
				alias: {
					$src: path.resolve('./src')
				}
			},
			optimizeDeps: {
				//include: ['$lib/grid/input.svelte'],
			},
			ssr: {
				//noExternal: ['$lib/grid/input.svelte'],
			}
		},
		adapter: adapter({
			// default options are shown
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
