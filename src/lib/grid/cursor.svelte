<script>
	export let style = {
		w: 0, // width
		h: 0, // height
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
		width: ${transform.w ? transform.w : style.w}px;
		height: ${transform.h ? transform.h : style.h}px;
		top: ${style.y + transform.y}px;
		left: ${style.x + transform.x}px;
	`;
</script>

<template lang="pug">
	#cursor(style="{css}")
		.row
		.row
</template>

<style lang="stylus" global>
	#cursor
		pointer-events  none
		display         flex
		flex-direction  column
		justify-content space-between
		position        absolute
		z-index         24
		transition      width $TimeTrans, height $TimeTrans, left $TimeTrans, top $TimeTrans
		will-change     width, height, left, top
		
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
