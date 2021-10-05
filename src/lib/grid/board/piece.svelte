<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Iconify from '@iconify/svelte';
	import { blockS, field, border } from '$src/store.js';
	import PieceIcon from '$lib/grid/board/pieceIcon.svelte';
</script>

<script>
	export let piece = {};
	export let moves = [];
	export let threats = [];
	export let active = false;

	let counter;
	$: counter = moves?.reduce(
		(obj, move) => {
			obj[move.type]++;
			return obj;
		},
		{
			move: 0,
			capture: 0
		}
	);
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
			PieceIcon(
				type="{piece.type}",
				color="{piece.color}"
			)
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
						&.threats
							margin-left auto
			
			> .piece-icon
				padding     $Spacing
				transition  transform $TimeTrans
				will-change transform
				
			&.b
				> .flags .text
					&.captures
						color $ColorPlayerBlack[1]
					&.threats
						color $ColorPlayerWhite[1]
				> svg > path
					fill $ColorPlayerBlack[1]
			
			&.w
				> .flags .text
					&.captures
						color $ColorPlayerWhite[1]
					&.threats
						color $ColorPlayerBlack[1]
				> svg > path
					fill $ColorPlayerWhite[1]
	
			&.captured
				opacity 0
			
			&.active
				position relative
				
				> .piece-icon
					transform rotateY(180deg)
</style>
