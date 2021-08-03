<script>
	import Grid from '$lib/grid.svelte';
	let gridElements = {
		board: {
			type: 'board',
			width: 8,
			height: 8
		},
		headline: {
			type: 'text',
			icon: 'memory',
			text: 'game.board_settings.headline'
		},
		fen: {
			type: 'input',
			value: '',
			label: 'game.board_settings.fen',
			name: 'code',
			placeholder: 'game.board_settings.fen_placeholder',
			icon: 'vpn_key'
		}
	};
	// 12:8 format
	// prettier-ignore
	let gridLayout = [
		[ 0, 8      , 4         ],
		[ 1, 'board', 'headline'],
		[ 1, 'board', 'fen'     ],
		[ 6, 'board', '.'       ],
	];
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>
