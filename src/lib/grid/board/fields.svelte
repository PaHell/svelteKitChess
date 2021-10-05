<script context="module">
	import { blockS, field, border } from '$src/store.js';
</script>

<script>
	export let active;
	const board = [];
	const size = 8;

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			board.push({
				x,
				y,
				color: (y % 2 && x % 2) || (!(y % 2) && !(x % 2)) ? 'white' : 'black'
			});
		}
	}
</script>

<template lang="pug">
	#fields
		+each('board as field, index')
			.field(
				class="{field.color}",
				class:active="{active === index}")
				p.text.caption
					span {String.fromCharCode(index%8 + 65)}{8 - Math.trunc(index/8)}
</template>

<style lang="stylus" global>
	#fields
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
				border-top-left-radius     $Radius
			&:nth-child(8)
				border-top-right-radius    $Radius
			&:nth-child(57)
				border-bottom-left-radius  $Radius
			&:nth-child(64)
				border-bottom-right-radius $Radius
			
			&.white
				background-color $ColorBGLight
				>.text
					color $Grey400
				
			&.black
				background-color $ColorBG
				>.text
					color $Grey500
			
			&.active
				position relative
			
			> .text
				margin $SpacingSmall
		
		&.active > .field.active
			box-shadow $ShadowRaised
</style>
