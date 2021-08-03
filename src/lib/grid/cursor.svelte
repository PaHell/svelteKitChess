<script context="module">
	import { blockW, blockH, spaceL } from '$src/store.js';
</script>

<script>
	export let style = {
		w: 1, // width
		h: 1, // height
		x: 0, // left
		y: 0 // top
	};
	export let transform = {
		x: 0, // add x offset
		y: 0, // add y offset
		w: false, // override width
		h: false // override height
	};
	let css = '';
	$: css = `
		width: ${(transform.w ? transform.w : style.w) * ($blockW + $spaceL) - $spaceL}px;
		height: ${(transform.h ? transform.h : style.h) * ($blockH + $spaceL) - $spaceL}px;
		margin:
			${style.y * ($blockH + $spaceL) + transform.y * $blockH}px
			0
			0
			${style.x * ($blockW + $spaceL) + transform.x * $blockW}px
		;
	`;
</script>

<template lang="pug">
	#container-cursor
		#cursor(style="{css}")
			.row
			.row
</template>

<style lang="stylus" global>
	#container-cursor
		overflow       visible
		pointer-events none
		width          0
		height         0
		position       absolute
		z-index        24
		> #cursor
			display         flex
			flex-direction  column
			justify-content space-between
			width           $SizeBlock
			height          $SizeBlock
			transition      width $TimeTrans, height $TimeTrans, margin $TimeTrans, opacity $TimeTrans
			will-change     width, height, margin
			
			> .row
				width           100%
				display         flex
				justify-content space-between
			
				&:before,
				&:after
					content ''
					display block
					width   $Radius
					height  $Radius
					border  0 solid $ColorAccent
				&:first-child:before
					border-width $WidthBorder 0 0 $WidthBorder
					border-top-left-radius $Radius
				&:first-child:after
					border-width  $WidthBorder $WidthBorder 0 0
					border-top-right-radius $Radius
				
				&:last-child:before
					border-width 0 0 $WidthBorder $WidthBorder
					border-bottom-left-radius $Radius
				&:last-child:after
					border-width 0 $WidthBorder $WidthBorder 0
					border-bottom-right-radius $Radius
</style>