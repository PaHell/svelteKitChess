<svelte:options accessors={true} />

<script context="module">
	import { _ } from 'svelte-i18n';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	import { cellHeight } from '$lib/../store.js';
	import { objToCss } from '$lib/../helpers.js';
	import Cursor from '$lib/grid/cursor.svelte';

	export let active;
	export let props;
	export let hideCursor;
	const defaults = {
		icon: '',
		label: 'Select',
		options: {},
		selected: ''
	};
	props = { ...defaults, ...props };
	let expanded = false;
	let hovered = 0;
	let storeCellHeight;

	export const onClick = () => {
		expanded = !expanded;
	};
	export const onLeave = () => {
		expanded = false;
		hovered = 0;
		hideCursor = false;
	};

	export function handleKeydown(event) {
		let stopExecutionInParent = false;
		if (expanded) {
			const keys = Object.keys(props.options);
			const index = keys.indexOf(props.selected);
			switch (event.keyCode) {
				case 38:
					// up
					if (hovered > 0) hovered--;
					else hovered = keys.length;
					stopExecutionInParent = true;
					break;
				case 40:
					// down
					if (hovered < keys.length) hovered++;
					else hovered = 0;
					stopExecutionInParent = true;
					break;
				case 13:
					// enter
					if (hovered !== 0) {
						setSelected(keys[hovered - 1]);
						stopExecutionInParent = true;
					}
					break;
			}
		}
		hideCursor = hovered !== 0;
		return stopExecutionInParent;
	}

	function setSelected(key) {
		props.selected = key;
		expanded = false;
		hideCursor = false;
		hovered = 0;
		if (props.onChange) props.onChange(key, props.options[key]);
	}
</script>

<template lang="pug">
	.cell-select(
		class:active,
		class:expanded,
		style="{`height: ${expanded ? (Object.keys(props.options).length + 1) * $cellHeight : $cellHeight}px`}")
		Cursor(style="{objToCss({'margin-top': hovered * $cellHeight })}", shown="{expanded}")
		button(on:click)
			Icon {props.icon}
			div
				p.text.label {$_(props.label)}:
				p.text.bold {$_(props.options[props.selected])}
			Icon arrow_drop_down
		.options
			+each('Object.entries(props.options) as [key, value], index')
				button(
					class:hovered="{hovered - 1 === index}",
					class:selected="{key === props.selected}",
					on:click|preventDefault!="{() => setSelected(key)}",)
					.control
					p.text.bold {$_(value)}
</template>

<style lang="stylus" global>
		
	.cell-select
		overflow         hidden
		height           $SizeBlock
		box-shadow       $Shadow
		background-color $ColorBG
		border-radius    $Radius
		transition       height $TimeTrans, box-shadow $TimeTrans, background-color $TimeTrans !important
		will-change      height
		
		> #container-cursor
			width 100%

			> #cursor
				width  50%
				height $SizeBlock
				margin-left 25%
		
		> button
			display         flex
			align-items     center
			width           100%
			height          $SizeBlock
			
			> .icon
				width $SizeBlock
				
				&:last-child
					color            $ColorIconTri
					transform-origin center center
					transition       color $TimeTrans, transform $TimeTrans
				
			> div
				flex 1
				
				> .text
					ellipsis()
					
					&.label
						font-size      $FZ_Caption
						text-transform uppercase
						font-weight    $FW_Bold
						color          $ColorBlackTextTri
						letter-spacing .25px
		
		> .options
			flex 1
			
			> button
				display      flex
				align-items  center
				width        100%
				height       $SizeBlock
				
				> .control
					width            $FZ_IconSmall
					height           $FZ_IconSmall
					margin           .5 * ($SizeBlock - $FZ_IconSmall)
					border-radius    100%
					border           $WidthBorder solid $ColorIconTri
					background-color $ColorBGLight
					transition       border-color $TimeTrans
					
					&:after
						content ''
						display block
						width $FZ_IconSmall - 6 * $WidthBorder
						height $FZ_IconSmall - 6 * $WidthBorder
						margin 2 * $WidthBorder
						border-radius 100%
				
				&.hovered > .control
					border-color $ColorIconPri
				
				&.selected > .control
					border-color $ColorAccentIcon
					&:after
						background-color $ColorAccentIcon
						
		&.active
			> button > .icon
				&:first-child
					color $ColorAccentIcon
				&:last-child
					color $ColorIconPri
						
		&.expanded
			> button > .icon:last-child
				transform rotateX(180deg)
</style>
