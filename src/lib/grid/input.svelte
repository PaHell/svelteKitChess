<svelte:options accessors={true} />

<script context="module">
	import { _ } from 'svelte-i18n';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let active;
	export let props;
	export let specs = {};
	const defaults = {
		label: false,
		icon: false,
		value: false,
		name: false,
		placeholder: 'placeholder',
		disabled: false
	};
	props = { ...defaults, ...props };

	// DOM node
	let ref;

	// Events
	export const onEnter = (event) => {
		ref.focus();
	};
	export const onLeave = (event) => {
		ref.blur();
	};
</script>

<template lang="pug">
	.cell-input(class:active)
		input(
			type="text",
			name="{props.name}",
			on:click,
			bind:value="{props.value}",
			bind:this="{ref}",
			disabled="{props.disabled}",
			placeholder="",
			class:has-icon="{props.icon}",
			class:has-label="{props.label}")
		.overlay
			+if('props.icon')
				Icon {props.icon}
			.right
				+if('props.label')
					p.text.label {$_(props.label)}:
				p.text.placeholder {props.value ? '' : $_(props.placeholder)}
				.line
</template>

<style lang="stylus" global>

	$InputLabelHeight = $FZ_Caption + 4px
	$InputLineHeight = $SizeBlock - 2 * $InputLabelHeight - 4 * $WidthBorder

	.cell-input
		display        flex
		flex-direction column
		
		> *
			height $SizeBlock
			
			&:not(:first-child)
				margin-top -1 * $SizeBlock
			
		> input
			padding       $WidthBorder .5 * ($SizeBlock - $FZ_Icon)
			line-height   $InputLineHeight
			border-radius $Radius - $WidthBorder
			
			&.has-label
				padding-top $InputLabelHeight - 4 * $WidthBorder

			&.has-icon
				padding-left $SizeBlock - $WidthBorder
				
			&:not(.has-label)
				padding-bottom $InputLabelHeight - 6 * $WidthBorder
				
				~ .overlay > .right
					margin-top ($InputLabelHeight + $WidthBorder)

			&:not(.has-icon)
				
				~ .overlay > .right
					margin-left  .5 * ($SizeBlock - $FZ_Icon)
			
			&:focus ~ .overlay
				> .icon
					color $ColorAccentIcon
				> .right
					> .label
						color $ColorBlackTextSec
					> .placeholder
						padding-left     2px
						background-image linear-gradient(to right, $ColorBlackTextSec, transparent 1.25*$SizeBlock)
					> .line
						background-color $ColorAccentIcon
		
		> .overlay
			display        flex
			pointer-events none
			
			> .icon
				width       $SizeBlock
				height      $SizeBlock
			
			> .right
				width         'calc(100% - %s)' % $SizeBlock
				padding-right .5 * ($SizeBlock - $FZ_Icon)
				
				> .text
					ellipsis()
				
				> .label
					height         $InputLabelHeight
					margin-top     4 * $WidthBorder
					font-size      $FZ_Caption
					text-transform uppercase
					font-weight    $FW_Bold
					line-height    $InputLabelHeight
					color          $ColorBlackTextTri
					letter-spacing .25px
				
				> .placeholder
					height            $InputLineHeight
					line-height       $InputLineHeight
					color             $ColorBlackTextTri
					transition        padding-left $TimeTrans, background-image $TimeTrans
					// gradient fade out text
					background-color        transparent
					background-image        linear-gradient(to right, $ColorBlackTextTri, transparent 1.25*$SizeBlock)
					background-size         100%
					-webkit-background-clip text
					-moz-background-clip    text
					-webkit-text-fill-color transparent
					-moz-text-fill-color    transparent
				
				> .line
					height           $WidthBorder
					margin-bottom    $InputLabelHeight - $WidthBorder
					border-radius    $Radius
					background-color $ColorBorder
					transition       background-color $TimeTrans
</style>
