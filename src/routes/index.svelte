<script>
	import { set as setLocale, get as getLocale } from '../i18n';
	import Grid from '$lib/grid.svelte';
	let gridElements = {
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
			label: 'general.language',
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
			text: 'index.computer.heading',
			info: 'index.computer.info'
		},
		cFirstMove: {
			autofocus: true,
			//
			type: 'select',
			label: 'index.computer.first_move.label',
			icon: 'looks_one',
			selected: false,
			options: {
				random: 'index.computer.first_move.random',
				you: 'index.computer.first_move.you',
				computer: 'index.computer.first_move.computer'
			}
		},
		cDifficulty: {
			type: 'select',
			label: 'index.computer.difficulty.label',
			icon: 'model_training',
			selected: 'easy',
			options: {
				easy: 'index.computer.difficulty.easy',
				medium: 'index.computer.difficulty.medium',
				hard: 'index.computer.difficulty.hard',
				impossible: 'index.computer.difficulty.impossible'
			}
		},
		cStart: {
			type: 'button',
			icon: 'play_arrow',
			text: 'index.computer.start_game',
			value: () => {
				console.log('starting game...');
			}
		},
		pHeadline: {
			type: 'text',
			icon: 'connect_without_contact',
			text: 'index.player.heading',
			info: 'index.player.info'
		},
		pCode: {
			type: 'input',
			value: '',
			label: 'index.player.lobby_code.label',
			name: 'code',
			placeholder: 'index.player.lobby_code.placeholder',
			icon: 'vpn_key'
		},
		pName: {
			type: 'input',
			value: '',
			label: 'index.player.nickname.label',
			name: 'given-name',
			placeholder: 'index.player.nickname.placeholder',
			icon: 'person'
		},
		pConnect: {
			type: 'button',
			icon: 'rss_feed',
			text: 'index.player.connect',
			value: () => {
				console.log('connecting...');
			}
		},
		pHost: {
			type: 'button',
			icon: 'dns',
			text: 'index.player.host',
			value: '/host'
		},
		tHeadline: {
			type: 'text',
			icon: 'extension',
			text: 'index.training.heading'
		},
		tAll: {
			type: 'button',
			icon: 'format_list_bulleted',
			text: 'index.training.list_all',
			value: '/training'
		},
		tContinue: {
			type: 'button',
			icon: 'fast_forward',
			text: 'index.training.continue',
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
