<svelte:options accessors={true} />

<script context="module">
	import { _ } from 'svelte-i18n';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let active;
	export let props;
	const defaults = {
		text: 'text',
		icon: false,
		variant: 'checkbox',
		value: false,
		disabled: false
	};
	props = { ...defaults, ...props };

	export const onClick = (event) => {
		props.value = !props.value;
	};
</script>

<template lang="pug">
	button.cell-checkbox(on:click, disabled="{props.disabled}", class:active)
		+if('props.icon')
			Icon {props.icon}
		p.text.bold {$_(props.text)}
		.control(
			class="{props.variant}",
			class:checked="{props.value}")
			div
				Icon done
</template>

<style lang="stylus" global>
	.cell-checkbox
		display         flex
		align-items     center
		justify-content center
		width           100%
		height          100%
		
		> .icon
			width $SizeBlock
		
		> .text
			flex 1
			padding-right .5 * ($SizeBlock - $FZ_Icon)
			ellipsis()
			
			&:first-child
				padding-left .5 * ($SizeBlock - $FZ_Icon)
		
		> .control
			
			&.checkbox
				width            $FZ_IconSmall
				height           $FZ_IconSmall
				margin-right     .5 * ($SizeBlock - $FZ_Icon)
				border           $WidthBorder solid $ColorIconTri
				border-radius    .4 * $FZ_IconSmall
				background-color $ColorBGLight
				
				> div
					width         $FZ_Icon
					height        $FZ_Icon
					margin-top    -.5 * ($FZ_Icon - $FZ_IconSmall) - $WidthBorder - 2px
					margin-left   -1px
					
					> .icon
						width            100%
						height           100%
						line-height      $FZ_Icon
						color            $ColorIconSec
						transform        scale(.5) rotateY(90deg)
						transform-origin 30% 75%
						transition       transform $TimeTrans, color $TimeTrans
			
				&.checked > div > .icon
					transform scale(1) rotateY(0)
				
			&.toggle
				width            1.75 * $FZ_IconSmall
				height           $FZ_IconSmall
				margin-right     .5 * ($SizeBlock - $FZ_Icon)
				border           $WidthBorder solid $ColorIconTri
				border-radius    .4 * $FZ_IconSmall
				background-color $ColorBG
				
				> div
					width            @height
					height           @height
					margin           -1 * $WidthBorder
					border           $WidthBorder solid $ColorIconSec
					border-radius    @border-radius
					background-color $ColorBGLight
					transition       margin-left $TimeTrans, border-color $TimeTrans
					will-change      margin-left
					
					> .icon
						display none

				&.checked > div
					margin-left .75 * $FZ_IconSmall - $WidthBorder
		
		&.active
			> .icon
				color $ColorAccentIcon
			
			> .control
				&.checkbox > div > .icon
					color $ColorAccentIcon
				&.toggle > div
					border-color $ColorAccentIcon
</style>
