<svelte:options accessors={true} />

<script context="module">
	import { goto } from '$app/navigation';
	import { _ } from 'svelte-i18n';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let active;
	export let props;
	export let specs = {};
	const defaults = {
		icon: false,
		text: false,
		value: (e) => {
			console.log('button has no fn', e);
		},
		disabled: false
	};
	props = { ...defaults, ...props };

	function detectValueType(val) {
		if (typeof val === 'string' || val instanceof String) {
			if (val.substring(0, 4) === 'http') return 'url';
			return 'link';
		}
		return 'func';
	}

	const type = detectValueType(props.value);
	if (type === 'url' && !props.icon) props.icon = 'public';

	export function onClick(event) {
		switch (type) {
			case 'link':
				if (props.value !== window.location.pathname) goto(props.value);
				break;
			case 'url':
				window.open(props.value, '_blank').focus();
				break;
			case 'func':
				props.value(event);
				break;
			default:
		}
	}
</script>

<template lang="pug">
	button.cell-button(
		on:click,
		disabled="{props.disabled}",
		class:active,
		class="{type}")
		+if('props.icon')
			Icon {props.icon}
		+if('props.text')
			p.text.bold {$_(props.text)}
		+if('type === "link"')
			Icon chevron_right
		+if('type === "url"')
			Icon launch
</template>

<style lang="stylus" global>
	.cell-button
		display          flex
		align-items      center
		justify-content  center
		width            100%
		height           100%
		
		> .icon
			width       $FZ_Icon
			flex-shrink 0
			
			&:first-child
				margin 0 .5 * ($SizeBlock - $FZ_Icon)
			&:last-child
				margin-right .5 * ($SizeBlock - $FZ_Icon)
			
		> .text
			font-size      $FZ_Button
			text-transform uppercase
			
			&:last-child
				margin-right .5 * ($SizeBlock - $FZ_Icon)

		&.url,
		&.link
			justify-content flex-start
			
			> .text
				flex 1
					
		&.active
			> .icon
				&:first-child
					color $ColorAccent
				&:last-child
					color $ColorIconPri
	
		&[disabled]
			> .icon
				color $ColorIconTri !important
			> .text
				color $ColorBlackTextTri

</style>
