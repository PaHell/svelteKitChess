<script>
	export let style;
	export let shown = true;
</script>

<template lang="pug">
	#container-cursor
		#cursor(style="{style}", class:hidden="{!shown}")
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
			transition      width $TimeTrans, height $TimeTrans, margin $TimeTrans, opacity $TimeTrans
			will-change     width, height, margin, opacity
			
			&.hidden
				opacity .25
			
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
