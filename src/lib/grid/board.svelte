<svelte:options accessors={true} />

<script context="module">
	import { _ } from 'svelte-i18n';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let active;
	export let props;
	const defaults = {};
	props = { ...defaults, ...props };

	const size = 8;
	const board = [];
	let hovered = 0;

	export function onLeave() {
		hovered = 0;
	}

	export function handleKeydown(event) {
		let parentContinue = true;
		switch (event.keyCode) {
			case 38: // up
				if (hovered > size - 1) {
					hovered -= size;
					parentContinue = false;
				}
				break;
			case 40: // down
				if (hovered < Math.pow(size, 2) - size) {
					hovered += size;
					parentContinue = false;
				}
				break;
			case 37: // left
				if (hovered % size) {
					hovered--;
					parentContinue = false;
				}
				break;
			case 39: // right
				if (hovered % size !== size - 1) {
					hovered++;
					parentContinue = false;
				}
				break;
			case 13: // enter
				console.log('enter:', hovered, board[hovered].x, board[hovered].y)
				break;
		}
		return {
			continue: parentContinue,
			cursor: {
				x: hovered % size,
				y: Math.trunc(hovered / size),
				w: 1,
				h: 1
			}
		};
	}

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			board.push({
				x,
				y,
				color: y % 2 && x % 2 || !(y % 2) && !(x % 2) ? 'white' : 'black',
				name: `i:${y * size + x}, (${x}|${y})`
			});
		}
	}
</script>

<template lang="pug">
	.board
		+each('Array(2) as _, i')
			.legend.row(style="{`grid-area: row${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { i+1 }
		+each('Array(2) as _, i')
			.legend.col(style="{`grid-area: col${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { String.fromCharCode(65 + i) }
		.container
			+each('board as field, index')
				.field(class="{field.color}", class:hovered="{index === hovered}") {field.name}
</template>

<style lang="stylus" global>
	$SizeField = 1.125 * $SizeBlock
	$SizeLegend = $SizeBlockSmall
	.board
		display          grid
		grid-template-areas   ".    col0      .   "\
		                      "row0 container row1"\
		                      ".    col1      .   "
		grid-template-columns $SizeLegend (8 * ($SizeField + $WidthBorder) + $WidthBorder) $SizeLegend
		grid-template-rows    $SizeLegend (8 * ($SizeField + $WidthBorder) + $WidthBorder) $SizeLegend
		width            100%
		height           100%
		background-color transparent !important
		box-shadow       none !important
		
		> .legend
			
			> .text
				text-align center
				color      $ColorBlackTextTri
			
			&.col
				display flex
				
				> .text
					width        $SizeField + $WidthBorder
					height       $SizeLegend
					line-height  $SizeLegend + 2 * $LHC
					margin-right $WidthBorder
					
					&:first-child
						margin-left $WidthBorder
			
			&.row
				display        flex
				flex-direction column

				> .text
					width         $SizeLegend
					height        $SizeField + $WidthBorder
					line-height   $SizeField + 2 * $LHC
					margin-bottom $WidthBorder
					
					&:first-child
						margin-top $WidthBorder

		> .container
			grid-area             container
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
					position   relative
					box-shadow $ShadowRaised
					
</style>
