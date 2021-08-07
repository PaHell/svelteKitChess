<script>
	import { onMount } from 'svelte';
	import Grid from '$lib/grid.svelte';
	import Stockfish from 'stockfish.wasm';
	let gridElements = {
		board: {
			type: 'board',
			pieces: [
				{ type: 'r', pos: 11 },
				{ type: 'b', pos: 21 },
				{ type: 'n', pos: 35 },
				{ type: 'q', pos: 51 },
				{ type: 'k', pos: 63 }
			]
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

	// MOUNTED
	onMount(() => {
		Stockfish().then((sf) => {
			sf.addMessageListener((line) => {
				console.log(line);
			});
			sf.postMessage('uci');
		});
	});
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>
