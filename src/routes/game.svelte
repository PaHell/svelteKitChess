<script>
	import { onMount } from 'svelte';
	import Grid from '$lib/grid.svelte';
	import Chess from '$src/chess';
	let gridElements = {
		board: {
			type: 'board',
			pieces: new Map(),
			captured: {},
			turn: 1,
			players: [
				{
					type: 'c',
					name: 'Stockfish 12',
					level: 'Hard',
				},
				{
					type: 'p',
					name: 'David Noah',
					level: '420',
				},
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
		[ 7, 'board', '.'       ],
	];
	let chess;
	function onMessage(msg) {
		const split = msg.split(' ');
		switch (split[0]) {
			case 'bestmove':
				console.log(`bestmove: %c${split[1]}`, 'color: red;');
				const [
					changes,
					flag
				] = chess.move(gridElements.board.pieces, split[1]);
				// process changes
				changes.forEach((val, key) => {
					if (val.pos === -1) {
						if (gridElements.board.captured[val.type] > 0) {
							gridElements.board.captured[val.type]++;
						} else gridElements.board.captured[val.type] = 1;
					}
					gridElements.board.pieces.set(key, val);
				});
				// force reactivity
				gridElements.board.pieces = gridElements.board.pieces;
				// next move
				//setTimeout(chess.bestmove(), 1000);
				break;
			case '':
			case 'id':
			case 'uciok':
			case 'option':
				//console.log(`%c${msg}`, 'color: gray;');
				break;
			case 'info':
				if (split[1] !== 'depth') console.log(`%c${msg}`, 'color: lightgreen;');
				else console.log(`%c${msg}`, 'color: green;');
				break;
			default:
				console.log(`%c${msg}`, 'color: yellow;');
		}
	}
	let fen = '4r1k1/r1q2ppp/ppp2n2/4P3/5Rb1/1N1BQ3/PPP3PP/R5K1 w - - 1 17';
	fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
	// MOUNTED
	onMount(() => {
		setTimeout(() => {
			chess = new Chess(onMessage);
			gridElements.board.pieces = chess.new(fen, 1);
			chess.bestmove();
		}, 2000);
	});
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>