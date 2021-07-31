<script>
	import { set as setLocale, get as getLocale } from '../i18n';
	import Grid from '$lib/grid.svelte';
	let gridElements = {
		cFirstMove: {
			type: 'select',
			label: 'index.first_move',
			icon: 'looks_one',
			selected: 'random',
			options: {
				random: 'index.first_move_random',
				you: 'index.first_move_you',
				computer: 'index.first_move_computer'
			}
		},
		heading: {
			type: 'text',
			text: 'index.title',
			icon: 'sports_esports',
			level: 'heading'
		},
		about: {
			type: 'button',
			icon: 'feed',
			value: '/about'
		},
		settings: {
			type: 'button',
			icon: 'settings',
			value: '/settings'
		},
		language: {
			type: 'select',
			label: 'index.language',
			icon: 'public',
			selected: getLocale(),
			options: {
				en: 'languages.en',
				de: 'languages.de',
				'de-sw': 'languages.sw'
			},
			onChange: (key) => setLocale(key)
		},
		cHeadline: {
			type: 'text',
			icon: 'memory',
			text: 'index.vs_computer',
			info: 'index.vs_computer_info'
		},
		cDifficulty: {
			type: 'select',
			label: 'index.difficulty',
			icon: 'model_training',
			selected: 'easy',
			options: {
				easy: 'index.difficulty_easy',
				medium: 'index.difficulty_medium',
				hard: 'index.difficulty_hard',
				impossible: 'index.difficulty_impossible'
			}
		},
		cStart: {
			type: 'button',
			icon: 'play_arrow',
			text: 'index.start_game',
			value: () => {
				console.log('starting game...');
			}
		},
		pHeadline: {
			type: 'text',
			icon: 'connect_without_contact',
			text: 'index.vs_player',
			info: 'index.vs_player_info'
		},
		pCode: {
			type: 'input',
			value: '',
			label: 'index.lobby_code',
			name: 'code',
			placeholder: 'index.lobby_code_placeholder',
			icon: 'vpn_key'
		},
		pName: {
			type: 'input',
			value: '',
			label: 'index.your_name',
			name: 'given-name',
			placeholder: 'index.your_name_placeholder',
			icon: 'person'
		},
		pConnect: {
			type: 'button',
			icon: 'rss_feed',
			text: 'index.connect',
			value: () => {
				console.log('connecting...');
			}
		},
		pHost: {
			type: 'button',
			icon: 'dns',
			text: 'index.host',
			value: '/host'
		},
		tHeadline: {
			type: 'text',
			icon: 'extension',
			text: 'index.training'
		},
		tAll: {
			type: 'button',
			icon: 'format_list_bulleted',
			text: 'index.list',
			value: '/training'
		},
		tContinue: {
			type: 'button',
			icon: 'fast_forward',
			text: 'index.continue',
			value: () => {
				console.log('continue training...');
			},
			disabled: true
		}
	};
	// 12:8 format
	// prettier-ignore
	let gridLayout = [
		[ 0, 4           , 3            , 1            , 1          , 3           ],
		[ 1, 'heading'   , 'heading'    , 'about'      , 'settings' , 'language'  ],
		[ 1, 'cHeadline' , 'cHeadline'  , 'cHeadline'  , 'cHeadline', 'cHeadline' ],
		[ 1, 'cFirstMove', 'cDifficulty', 'cDifficulty', 'cStart'   , 'cStart'    ],
		[ 1, 'pHeadline' , 'pHeadline'  , 'pHeadline'  , 'pHeadline', 'pHeadline' ],
		[ 1, 'pCode'     , 'pName'      , 'pName'      , 'pConnect' , 'pConnect'  ],
		[ 1, 'pHost'     , '.'          , '.'          , '.'        , '.'         ],
		[ 1, 'tHeadline' , 'tHeadline'  , 'tHeadline'  , 'tHeadline', 'tHeadline' ],
		[ 1, 'tAll'      , 'tContinue'  , 'tContinue'  , '.'        , '.'         ],
	];
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>
