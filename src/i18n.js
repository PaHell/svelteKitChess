import {
	register,
	addMessages,
	init as initI18n,
	locale
	//getLocaleFromNavigator
} from 'svelte-i18n';

import en from './locale/en.json';

export function init() {
	// always load
	addMessages('en', en);
	// async loading
	register('de', () => import('./locale/de.json'));
	register('de-sw', () => import('./locale/de-sw.json'));

	// initialize
	initI18n({
		fallbackLocale: 'en',
		initialLocale: 'en' //getLocaleFromNavigator()
	});
}

export function set(id) {
	locale.set(id);
}

export function get() {
	let current;
	locale.subscribe((val) => (current = val))();
	return current;
}
