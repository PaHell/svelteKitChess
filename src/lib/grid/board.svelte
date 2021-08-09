<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Icon from '$lib/icon.svelte';
	import { blockS, field, border } from '$src/store.js';
</script>

<script>
	export let active;
	export let props;
	const defaults = {
		pieces: new Map()
	};
	props = { ...defaults, ...props };

	const dispatch = createEventDispatcher();
	const size = 8;
	const board = [];
	let hovered = 0;

	export function onEnter() {
		updateCursor();
	}

	export function handleKeydown(event) {
		let parentStop = false;
		switch (event.keyCode) {
			case 38: // up
				if (hovered > size - 1) {
					hovered -= size;
					parentStop = true;
				}
				break;
			case 40: // down
				if (hovered < Math.pow(size, 2) - size) {
					hovered += size;
					parentStop = true;
				}
				break;
			case 37: // left
				if (hovered % size) {
					hovered--;
					parentStop = true;
				}
				break;
			case 39: // right
				if (hovered % size !== size - 1) {
					hovered++;
					parentStop = true;
				}
				break;
			case 13: // enter
				console.log('enter:', hovered, board[hovered].x, board[hovered].y);
				break;
		}
		updateCursor();
		return parentStop;
	}

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			board.push({
				x,
				y,
				color: (y % 2 && x % 2) || (!(y % 2) && !(x % 2)) ? 'white' : 'black',
				index: x + y * 8
			});
		}
	}

	function updateCursor() {
		dispatch('cursor', {
			x: $blockS + ($field + $border) * (hovered % size),
			y: $blockS + ($field + $border) * Math.trunc(hovered / size),
			w: $field + 2 * $border,
			h: $field + 2 * $border
		});
	}
</script>

<template lang="pug">
	.container-board
		+each('Array(2) as _, i')
			.legend.row(style="{`grid-area: row${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { size-i }
		+each('Array(2) as _, i')
			.legend.col(style="{`grid-area: col${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { String.fromCharCode(65 + i) }
		.board(class:active)
			+each('board as field, index')
				.field(class="{field.color}", class:hovered="{index === hovered}")
					p.text.caption {index}
		.pieces
			+each('[...props.pieces.values()] as piece')
				.container
					button(style!="{`margin:\
						${Math.trunc(piece.pos / size) * ($field + $border)}px\
						0\
						0\
						${(piece.pos % size) * ($field + $border)}px\
					;`}")
						img(src="{`pieces/${piece.type}.svg`}")
</template>

<style lang="stylus" global>
	$SizeBoard = (8 * ($SizeField + $WidthBorder) + $WidthBorder)
	.container-board
		display               grid
		grid-template-areas   "pieces col0  .   "\
		                      "row0   board row1"\
		                      ".      col1  .   "
		grid-template-columns $SizeBlockSmall $SizeBoard $SizeBlockSmall
		grid-template-rows    $SizeBlockSmall $SizeBoard $SizeBlockSmall
		width                 100%
		height                100%
		background-color      transparent !important
		box-shadow            none !important
		position              static !important
		
		> .legend
			
			> .text
				text-align center
				color      $ColorBlackTextTri
			
			&.col
				display flex
				
				> .text
					width        $SizeField + $WidthBorder
					height       $SizeBlockSmall
					line-height  $SizeBlockSmall + 2 * $LHC
					margin-right $WidthBorder
					
					&:first-child
						margin-left $WidthBorder
			
			&.row
				display        flex
				flex-direction column

				> .text
					width         $SizeBlockSmall
					height        $SizeField + $WidthBorder
					line-height   $SizeField + 2 * $LHC
					margin-bottom $WidthBorder
					
					&:first-child
						margin-top $WidthBorder

		> .board
			grid-area             board
			display               grid
			grid-template-columns repeat(8, $SizeField)
			grid-template-rows    repeat(8, $SizeField)
			grid-gap              $WidthBorder
			background-color      $ColorBorder
			border                $WidthBorder solid $ColorBorder
			border-radius         $Radius + $WidthBorder
			
			> .field
				border-radius $RadiusSmall
				transition    box-shadow $TimeTrans
				// testing
				//line-height   $SizeField
				//text-align    center
				
				&:nth-child(1)
					border-top-left-radius $Radius
				&:nth-child(8)
					border-top-right-radius $Radius
				&:nth-child(57)
					border-bottom-left-radius $Radius
				&:nth-child(64)
					border-bottom-right-radius $Radius
				
				&.white
					background-color $ColorBGLight
					
				&.black
					background-color $ColorBG
				
				&.hovered
					position    relative
					color       $ColorAccent
					font-weight $FW_Bold
			
			&.active > .field.hovered
				box-shadow $ShadowRaised
				
		> .pieces
			grid-area pieces
			width     $SizeBoard
			height    $SizeBoard
			margin    $SizeBlockSmall 0 0 $SizeBlockSmall
			padding   $WidthBorder 0 0 $WidthBorder
			position  relative
			
			> .container
				width  0
				height 0
			
				> button
					width            $SizeField
					height           $SizeField
					//background-color red
					//border-radius    ($Radius - 2px)
					transition       margin $TimeTrans
					
					> img
						width 100%
						height 100%
						padding $Spacing
</style>
