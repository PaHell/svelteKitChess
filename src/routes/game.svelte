<script context="module">
	import Engine from '$src/engine';
</script>

<script>
	import { onMount } from 'svelte';
	import Grid from '$lib/grid.svelte';

	let gridElements = {
		board: {
			type: 'board',
			pieces: [],
			moves: [],
			threats: [],
			captured: {},
			turn: 1,
			players: [
				{
					type: 'c',
					name: 'Stockfish 12',
					level: 'Hard'
				},
				{
					type: 'p',
					name: 'David Noah',
					level: '420'
				}
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
		[ 0, 8      , 3         ],
		[ 1, 'board', 'headline'],
		[ 1, 'board', 'fen'     ],
		[ 7, 'board', '.'       ],
	];

	let fen = '4r1k1/r1q2ppp/ppp2n2/4P3/5Rb1/1N1BQ3/PPP3PP/R5K1 w - - 1 17';
	// MOUNTED
	onMount(() => {
		const engine = new Engine(fen);
		gridElements.board.pieces = engine.getPieces();
		gridElements.board.moves = engine.getMoves();
		//gridElements.board.threats =
		gridElements.board.threats = engine.getThreats();
		//console.log(engine.move('Rxf6'));
	});
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>
