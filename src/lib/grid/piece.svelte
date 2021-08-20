<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Iconify from '@iconify/svelte';
	import { blockS, field, border } from '$src/store.js';
</script>

<script>
	export let piece = {};
	export let moves = {};
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
</script>

<template lang="pug">
	.piece-container
		button(
			on:click,
			class="{piece.color}",
			class:active="{active}",
			class:captured="{piece.pos === -1}",
			style!="{`margin:\
				${piece.pos[1] * ($field + $border)}px\
				0\
				0\
				${piece.pos[0] * ($field + $border)}px\
			;`}")
			.flags
				.top
					+if('threats.length')
						p.threats.text.caption.bold {threats.length}
				.bottom
					+if('moves.captures?.length')
						p.captures.text.caption.bold {moves.captures.length}
					+if('moves.moves?.length')
						p.moves.text.caption.bold {moves.moves.length}
			Iconify(icon="{`mdi:${pieceIcons[piece.type.toLowerCase()]}`}")
			//img(src="{`pieces/${piece.type}.svg`}")
			+if('active && moves.captures && moves.moves')
				+each('moves.captures as capture')
					p.text.caption Capture: { capture.san }
				+each('moves.moves as move')
					p.text.caption Move: { move.san }
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
				
			&.b > svg > path
				fill $Orange
			
			&.w > svg > path
				fill $ColorAccentIcon
	
			&.captured
				opacity 0
			
			&.moves
				//background radial-gradient($Green, transparent 50%)
			
			&.active
				position relative
				
				> svg
					transform rotateY(180deg)
</style>
