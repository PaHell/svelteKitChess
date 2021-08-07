<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { blockH } from '$lib/../store.js';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let active;
	export let props;
	const defaults = {
		icon: '',
		label: 'Select',
		options: {},
		selected: ''
	};
	props = { ...defaults, ...props };
	const dispatch = createEventDispatcher();
	let expanded = false;
	let hovered = 0;

	export function onClick() {
		expanded = !expanded;
		hovered = Object.keys(props.options).indexOf(props.selected) + 1;
		updateCursor();
	}
	export function onLeave() {
		expanded = false;
	}
	export function handleKeydown(event) {
		let parentStop = false;
		if (expanded) {
			const keys = Object.keys(props.options);
			const index = keys.indexOf(props.selected);
			switch (event.keyCode) {
				case 38: // up
					if (hovered > 0) hovered--;
					else hovered = keys.length;
					parentStop = true;
					break;
				case 40: // down
					if (hovered < keys.length) hovered++;
					else hovered = 0;
					parentStop = true;
					break;
				case 13: // enter
					if (hovered !== 0) {
						setSelected(keys[hovered - 1]);
						parentStop = true;
					}
					break;
			}
		}
		updateCursor();
		return parentStop;
	}
	function updateCursor() {
		dispatch('cursor', {
			y: expanded ? hovered * $blockH : 0
		});
	}
	function setSelected(key) {
		if (key !== props.selected) {
			props.selected = key;
			if (props.onChange) props.onChange(key, props.options[key]);
		}
		// close
		expanded = false;
		updateCursor();
	}
</script>

<template lang="pug">
	.cell-select(
		class:active,
		class:expanded,
		style="{`height: ${expanded ? (Object.keys(props.options).length + 1) * $blockH : $blockH}px`}")
		button(on:click, class:hovered!="{expanded && hovered === 0}")
			Icon {props.icon}
			div
				p.text.label {$_(props.label)}:
				p.text.bold {$_(props.selected ? props.options[props.selected] : 'general.select.none')}
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
			
			&.hovered > .icon:last-child
				color $ColorAccentIcon !important
		
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
					transition       border-color $TimeTrans, background-color $TimeTrans
					
					&:after
						content       ''
						display       block
						width         $FZ_IconSmall - 6 * $WidthBorder
						height        $FZ_IconSmall - 6 * $WidthBorder
						margin        2 * $WidthBorder
						border-radius 100%
				
				&.selected					
					> .control
						border-color $ColorIconPri
						&:after
							background-color $ColorIconPri
				&.hovered
					> .control
						border-color $ColorAccentIcon
						
					&.selected > .control:after
						background-color $ColorAccentIcon
						
		&.active > button > .icon
			&:first-child
				color $ColorAccentIcon
			&:last-child
				color $ColorIconPri
							
		&.expanded
			> button
				> .icon:last-child
					transform rotateX(180deg)
</style>
