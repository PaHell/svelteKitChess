<script context="module">
	// lang
	import { init as initI18n } from '$lib/../i18n';
	initI18n();

	/* import { waitLocale } from 'svelte-i18n';
	waitLocale(); */
</script>

<script>
	import { onMount } from 'svelte';
	import { blockW, blockH, spaceL } from '$src/store.js';

	let ref;
	onMount(() => {
		const { width, height, marginTop } = window.getComputedStyle(ref);
		$blockW.set(parseInt(width));
		$blockH.set(parseInt(height));
		$spaceL.set(parseInt(marginTop));
	});
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
		margin-top $SpacingLarge

</style>
