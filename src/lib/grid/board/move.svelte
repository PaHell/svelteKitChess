<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Iconify from '@iconify/svelte';
	import { blockS, field, border } from '$src/store.js';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let props = {};
	let iconArr = [];

	$: {
		let flags = Array.from(props.flags);
		iconArr = flags.reduce((arr, flag) => {
			arr.push(flagToIcon(flag));
			return arr;
		}, []);
	}

	function flagToIcon(flag) {
		switch (flag) {
			case 'n':
			case 'e':
				{
					const arr = [];
					const diffX = props.to[0] - props.from[0];
					const diffY = props.to[1] - props.from[1];
					if (diffY !== 0) arr.push(diffY > 0 ? 'south' : 'north');
					if (diffX !== 0) arr.push(diffX > 0 ? 'east' : 'west');
					return arr.join('_');
				}
				break;
			case 'b':
				{
					const diffY = props.to[1] - props.from[1];
					return diffY > 0 ? 'keyboard_double_arrow_down' : 'keyboard_double_arrow_up';
				}
				break;
			default:
				return {
					k: 'castle',
					q: 'castle',
					c: 'close',
					p: 'star'
				}[flag];
		}
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
			div(class="{props.color}")
				+each('iconArr as icon')
					Icon {icon}
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
				flex-direction  column
				align-items     center
				justify-content center
				height          100%

				&.w > .icon
					color $ColorPlayerWhite[0]
				&.b > .icon
					color $ColorPlayerBlack[0]

				> .icon
					width       $SizeMove
					height      $SizeMove
					line-height $SizeMove
					font-size   $FZ_IconLarge
					
			&:hover
				> .w > .icon
					color $ColorPlayerWhite[1]
				> .b > .icon
					color $ColorPlayerBlack[1]
			&:active
				> .w > .icon
					color $ColorPlayerWhite[2]
				> .b > .icon
					color $ColorPlayerBlack[2]
	
	@keyframes moveFieldIn
		to
			opacity 1
			transform scale(1)
</style>
