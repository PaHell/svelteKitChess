<script context="module">
	// lang
	import { init as initI18n } from '$lib/../i18n';
	initI18n();

	/* import { waitLocale } from 'svelte-i18n';
	waitLocale(); */
</script>

<script>
	import { onMount } from 'svelte';
	import { cellWidth, cellHeight, cellSpacing } from '../store.js';

	let ref;
	onMount(() => {
		const { width, height, marginTop } = window.getComputedStyle(ref);
		cellWidth.set(parseInt(width));
		cellHeight.set(parseInt(height));
		cellSpacing.set(parseInt(marginTop));
	});
</script>

<template lang="pug">
	#layout
		#ref.hidden(bind:this="{ref}")
		slot
</template>

<style lang="stylus" global>
	@import '../styles/app'

	#layout
		height          100%
		display         flex
		flex-direction  column
		align-items     center
		justify-content center
	
	#ref
		width  $SizeBlock
		height $SizeBlock
		margin $SpacingLarge

</style>
