<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { blockW, blockH, spaceL, border } from '$lib/../store.js';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	// const
	const ITEM_WIDTH = 2;
	const ITEM_HEIGHT = 2;
	// props
	export let active;
	export let props;
	export let specs;
	const defaults = {
		icon: '',
		text: '',
		items: [],
		callback: () => {}
	};
	props = { ...defaults, ...props };
	// local
	const dispatch = createEventDispatcher();
	let focused = 0;

	export function onEnter() {
		updateCursor();
	}
	export function handleKeydown(event) {
		let parentStop = false;
		const width = specs.w / ITEM_WIDTH;
		const height = specs.h / ITEM_HEIGHT;
		switch (event.keyCode) {
			case 37: // left
				if (focused % width !== 0) {
					focused -= 1;
					parentStop = true;
				}
				break;
			case 38: // up
				if (focused - width > -1) {
					focused -= width;
					parentStop = true;
				}
				break;
			case 39: // right
				if (focused % width < width - 1 && focused < props.items.length - 1) {
					focused += 1;
					parentStop = true;
				}
				break;
			case 40: // down
				if (focused + width < props.items.length) {
					focused += width;
					parentStop = true;
				}
				break;
			case 13: // enter
				onItemClick(focused);
				parentStop = true;
				break;
		}
		updateCursor();
		return parentStop;
	}

	function onItemClick(index) {
		focused = index;
		props.callback?.(props.items[index], index);
		updateCursor();
	}

	function updateCursor() {
		const w = specs.w / ITEM_WIDTH;
		const x = focused % w;
		const y = Math.trunc(focused / w);
		dispatch('cursor', {
			x: x * (ITEM_WIDTH * ($blockW + $spaceL)),
			y: y * (ITEM_HEIGHT * ($blockH + $spaceL)) + $blockH + $border,
			w: 2 * $blockW + $spaceL,
			h: 2 * $blockH + $spaceL
		});
	}
</script>

<template lang="pug">
	.cell-list(class:active)
		header
			+if('props.icon')
				Icon { props.icon }
			+if('props.text')
				p.text.headline.bold { props.text }
		.items
			+each('props.items as item, index')
				button(
					class:focused="{focused === index}",
					on:click|preventDefault!="{() => onItemClick(index)}",)
					p.text.bold {$_(item.text)}
</template>

<style lang="stylus" global>
		
	.cell-list
		background-color transparent !important
		box-shadow       none !important
		border-radius    0 !important
		border-top       $WidthBorder solid $ColorBorder
		
		> header
			display     flex
			align-items center
			padding     0 (.5 ($SizeBlock - $FZ_Icon))
			
			> .icon
				margin 0 (.5 * ($SizeBlock - $FZ_Icon))
			> .text
				ellipsis()
				flex          1
				
				margin-right  .5 ($SizeBlock - $FZ_Icon)
			
			> *
				margin 0
				&:first-child:last-child
					flex       1
					text-align center
		
		> .items
			display      flex
			flex-wrap    wrap
			margin       -.5 * $SpacingLarge

			> button
				width            (2 * $SizeBlock + $SpacingLarge)
				height           (2 * $SizeBlock + $SpacingLarge)
				margin           .5 * $SpacingLarge
				background-color $Red[0]
				
				&.focused
					background-color $ColorBGLight
			

</style>
