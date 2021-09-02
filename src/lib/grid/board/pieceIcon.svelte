<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Iconify from '@iconify/svelte';
	import { blockS, field, border } from '$src/store.js';
</script>

<script>
	export let type  = 'q';
	export let color = 'w';
	const pieceIcons = {
		p: 'chess-pawn',
		n: 'chess-knight',
		b: 'chess-bishop',
		r: 'chess-rook',
		q: 'chess-queen',
		k: 'chess-king'
	};
</script>

<template lang="pug">
	.piece-icon(class="{color}")
		Iconify(icon="{`mdi:${pieceIcons[type]}`}")
		//img(src="{`pieces/${type}.svg`}")
</template>

<style lang="stylus" global>
	.piece-icon
		width  100%
		height 100%
		
		> svg,
		> img
			width  100%
			height 100%

		&.b > svg > path
			fill $ColorPlayerBlack[1]
			
		&.w > svg > path
			fill $ColorPlayerWhite[1]	
</style>
