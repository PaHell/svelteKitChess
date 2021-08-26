<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Iconify from '@iconify/svelte';
	import { blockS, field, border } from '$src/store.js';
</script>

<script>
	export let piece = {};
	export let moves = [];
	export let threats = [];
	export let active = false;
	const pieceIcons = {
		p: 'chess-pawn',
		n: 'chess-knight',
		b: 'chess-bishop',
		r: 'chess-rook',
		q: 'chess-queen',
		k: 'chess-king'
	};

	let counter;
	$: counter = moves?.reduce((obj, move) => {
		obj[move.type]++;
		return obj;
	}, {
		move: 0,
		capture: 0
	});
</script>

<template lang="pug">
	.piece-container
		button(
			on:click,
			class="{piece.color}",
			class:active="{active}",
			class:captured="{piece.index === -1}",
			style!="{`margin:\
				${piece.pos[1] * ($field + $border)}px\
				0\
				0\
				${piece.pos[0] * ($field + $border)}px\
			;`}")
			.flags
				.top
					+if('threats?.length')
						p.threats.text.caption.bold {threats.length}
				.bottom
					+if('moves?.length')
						p.captures.text.caption.bold {counter.capture}
						p.moves.text.caption.bold {counter.move}
			Iconify(icon="{`mdi:${pieceIcons[piece.type.toLowerCase()]}`}")
			//img(src="{`pieces/${piece.type}.svg`}")
</template>

<style lang="stylus" global>
			
	.piece-container
		width  0
		height 0
	
		> button
			width         $SizeField
			height        $SizeField
			border-radius $Radius
			transition    margin $TimeTrans, opacity $TimeTrans
			
			> .flags
				display         flex
				flex-direction  column
				justify-content space-between
				position        absolute
				width           $SizeField
				height          $SizeField
				
				> *
					display flex
					width   100%
					padding $SpacingSmall ($SpacingSmall - $SpacingText/2)
				
					> .text
						margin      0 ($SpacingText/2)
						line-height $FZ_Caption

						&.moves
							margin-left auto
							color       $ColorBlackTextTri
						&.captures
							color       $ColorAccentIcon
						&.threats
							margin-left auto
							color       $Orange
			
			> img,
			> svg
				width       100%
				height      100%
				padding     $Spacing
				transition  transform $TimeTrans
				will-change transform
				
			&.b
				> .flags > .text
					&.captures
						color $Orange
					&.threats
						color $ColorAccentIcon
				> svg > path
					fill $Orange
			
			&.w
				> svg > path
					fill $ColorAccentIcon
	
			&.captured
				opacity 0
			
			&.active
				position relative
				
				> svg
					transform rotateY(180deg)
</style>
