<script context="module">
	import Engine from '$src/engine';
</script>

<script>
	import { onMount } from 'svelte';
	import Grid from '$lib/grid.svelte';
	import { lastGameConfig } from '$src/store';

	let gridElements = {
		board: {
			type: 'board',
			captured: {},
			skill: 20,
			depth: 5,
			turn: 0,
			iam: 0,
			players: [
				{},
				{}
			],
			pieces: [],
			moves: [],
			threats: []
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
		[ 0, 8      , 1         ],
		[ 1, 'board', 'headline'],
		[ 1, 'board', 'fen'     ],
		[ 7, 'board', '.'       ],
	];

	//let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	//fen = '1nbqkbn1/1pppppp1/8/8/8/8/PPPPPPPP/QNBQKBNQ w - - 0 1';
	//fen = '4r1k1/r1q2ppp/ppp2n2/4P3/5Rb1/1N1BQ3/PPP3PP/R5K1 w - - 1 17'; // complex
	//fen = 'r3k2r/2p3pp/p1nb1p2/1p4P1/7P/P4B2/1P2N1P1/R3K2R w KQkq - 1 20'; //castling
	//fen = 'rnbqkbnr/ppppp2p/8/1PP5/5pp1/8/P2PPPPP/RNBQKBNR w KQkq - 0 5'; // en passant
	//fen = '2q5/3P3k/8/8/8/8/K5p1/5Q2 b - - 0 35'; // promotion
	//fen = 'r2q1rk1/2pbbp2/p1n2n1p/1p1pp1p1/1P1PP1P1/P1N2N1P/2PBBP2/R2Q1RK1 w - - 2 12' // captures
	let engine;
	// MOUNTED
	onMount(() => {
		// init info
		gridElements.board = {
			...gridElements.board,
			// override
			captured: $lastGameConfig.captured,
			turn: $lastGameConfig.turn,
			iam: $lastGameConfig.iam,
			players: $lastGameConfig.players,
		}
		// init board
		engine = new Engine($lastGameConfig.fen);
		gridElements.board.pieces = engine.getPieces();
		gridElements.board.moves = engine.getMoves();
		gridElements.board.threats = engine.getThreats();

		/*
		setTimeout(() => {
			setInterval(() => {
				engine.getBestMove(1).then((result) => moveAndUpdate(result));
			}, 1500);
			setTimeout(() => {
				setInterval(() => {
					engine.getBestMove(0).then((result) => moveAndUpdate(result));
				}, 1500);
			}, 1500);
		}, 1500);
		*/
	});

	function moveAndUpdate(lan) {
		engine.move(lan).forEach(([i, change]) => {
			console.log('change:', i, change);
			// merge changes
			gridElements.board.pieces[i] = Object.assign(gridElements.board.pieces[i], change);
		});
		gridElements.board.turn = gridElements.board.turn === 0 ? 1 : 0;
		gridElements.board.moves = engine.getMoves();
		gridElements.board.threats = engine.getThreats();
	}

	function onMove({ detail: move }) {
		// player
		console.warn('onMove', move);
		moveAndUpdate(move.lan);
		// computer
		setTimeout(() => {
			//engine.getBestMove($lastGameConfig.difficulty).then((result) => moveAndUpdate(result));
		}, 200);
	}

</script>

<template lang="pug">
	Grid(
		bind:elements="{gridElements}",
		layout="{gridLayout}",
		on:event="{onMove}")
</template>
