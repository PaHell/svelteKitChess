<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Iconify from '@iconify/svelte';
	import { blockS, field, border } from '$src/store.js';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let props = {};

	let arrow = '';
	$: {
		const arr = [];
		const diffX = props.to[0] - props.from[0];
		const diffY = props.to[1] - props.from[1];
		if (diffY !== 0) arr.push(diffY > 0 ? 'south' : 'north');
		if (diffX !== 0) arr.push(diffX > 0 ? 'east' : 'west');
		arrow = arr.join('_');
	}
</script>

<template lang="pug">
	.move-container
		button(
			on:click,
			style!="{`margin:\
				${props.to[1] * ($field + $border)}px\
				0\
				0\
				${props.to[0] * ($field + $border)}px\
			;`}")
			div(
				class="{props.flag}",
				class:dark="{(props.to[0] + props.to[1]) % 2}",
			)
				+if('props.type === "move"')
					Icon {arrow}
				+if('props.type === "capture"')
					Icon close
</template>

<style lang="stylus" global>

	$SizeMove = (2 * $WidthBorder + $FZ_Icon)
			
	.move-container
		width  0
		height 0
	
		> button
			width           $SizeField
			height          $SizeField
			border-radius   $Radius
			position        relative
			vertical-align  bottom
			transform       scale(.5)
			opacity         0
			animation       moveFieldIn $TimeTrans forwards
			transition      margin $TimeTrans, opacity $TimeTrans, transform $TimeTrans
				
			> div
				display         flex
				align-items     center
				justify-content center
				height          100%

				> .icon
					width       $SizeMove
					height      $SizeMove
					line-height $SizeMove
					font-size   $FZ_IconLarge
					color       $Grey400
					
				&.dark > .icon
					color $Grey500
				
				&.c > .icon
					color $ColorAccentIcon

			&:hover > div > .icon
				color $ColorAccentTranslucent
			&:active > div > .icon
				color $ColorAccentIcon
	
	@keyframes moveFieldIn
		to
			opacity 1
			transform scale(1)			
</style>
