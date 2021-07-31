<script>
	import Grid from '$lib/grid.svelte';
	let gridElements = {
		back: {
			type: 'button',
			icon: 'arrow_back',
			value: '/'
		},
		settings: {
			type: 'text',
			text: 'Settings',
			icon: 'settings',
			level: 'heading'
		},
		game: {
			type: 'text',
			text: 'In-Game'
		},
		coord: {
			type: 'checkbox',
			text: 'Show Coordinates',
			icon: 'gps_fixed',
			variant: 'toggle',
			value: true
		},
		captured: {
			type: 'checkbox',
			text: 'Show Captured Pieces',
			icon: 'emoji_flags',
			variant: 'toggle',
			value: true
		},
		undo: {
			type: 'checkbox',
			text: 'Enable "Undo Move"',
			icon: 'undo',
			variant: 'toggle',
			value: false
		},
		history: {
			type: 'checkbox',
			text: 'Show Move Info and History',
			icon: 'history_toggle_off',
			variant: 'toggle',
			value: false,
			disabled: true
		},
		general: {
			type: 'text',
			text: 'General'
		},
		dark: {
			type: 'checkbox',
			text: 'Enable Dark Mode',
			icon: 'dark_mode',
			variant: 'toggle',
			value: false
		},
		links: {
			type: 'text',
			text: 'Links'
		},
		terms: {
			type: 'button',
			icon: 'gavel',
			text: 'Terms & Conditions',
			value: '/site/terms',
			variant: 'link'
		},
		privacy: {
			type: 'button',
			icon: 'security',
			text: 'Privacy Policy',
			value: '/site/privacy',
			variant: 'link'
		},
		imprint: {
			type: 'button',
			icon: 'description',
			text: 'Imprint',
			value: '/site/imprint',
			variant: 'link'
		},
		license: {
			type: 'button',
			icon: 'widgets',
			text: 'License & Packages',
			value: '/site/license',
			variant: 'link'
		},
		copyright: {
			type: 'text',
			text: '2021 Patrick Hellebrand. All rights reserved.',
			icon: 'copyright',
			level: 'caption'
		}
	};
	// prettier-ignore
	let gridLayout = [
		[ 0, 1     , 4          , 4          , 4          , 1   ], // 14:8 
		[ 1, 'back', 'settings' , 'settings' , 'settings' , '.' ],
		[ 1, '.'   , 'game'     , 'game'     , 'links'    , '.' ],
		[ 1, '.'   , 'coord'    , 'captured' , 'terms'    , '.' ],
		[ 1, '.'   , 'history'  , 'undo'     , 'privacy'  , '.' ],
		[ 1, '.'   , 'general'  , 'general'  , 'imprint'  , '.' ],
		[ 1, '.'   , 'dark'     , '.'        , 'license'  , '.' ],
		[ 1, '.'   , 'copyright', 'copyright', 'copyright', '.' ],
		[ 1, '.'   , '.'        , '.'        , '.'        , '.' ],
	];
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>

<style lang="stylus">

</style>
