<script context="module">
	// lang
	import { init as initI18n } from '$lib/../i18n';
	initI18n();

	/* import { waitLocale } from 'svelte-i18n';
	waitLocale(); */
</script>

<script>
	import { onMount } from 'svelte';
	import {
		blockW,
		blockH,
		blockS,
		field,
		border,
		spaceM,
		spaceS,
		spaceL
	} from '$src/store.js';

	let ref;
	/*
	onMount(() => {
		const {
			width,
			height,
			paddingTop,
			paddingLeft,
			paddingRight,
			marginLeft,
			marginRight,
			marginTop
		} = window.getComputedStyle(ref);
		$blockW.set(parseInt(width));
		$blockH.set(parseInt(height));
		$blockS.set(parseInt(paddingTop));
		$field.set(parseInt(paddingLeft));
		$border.set(parseInt(paddingRight));
		$spaceM.set(parseInt(marginLeft));
		$spaceS.set(parseInt(marginRight));
		$spaceL.set(parseInt(marginTop));
	});
	*/
</script>

<template lang="pug">
	#layout
		#ref.hidden(bind:this="{ref}")
		slot
</template>

<style lang="stylus" global>
	@import './src/styles/app'

	#layout
		height          100%
		display         flex
		flex-direction  column
		align-items     center
		justify-content center
	
	#ref
		width  $SizeBlock
		height $SizeBlock
		padding-top $SizeBlockSmall
		padding-left $SizeField
		padding-right $WidthBorder
		margin-left $Spacing
		margin-right $SpacingSmall
		margin-top $SpacingLarge

</style>
