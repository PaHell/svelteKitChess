<script context="module">
	// lang
	import { init as initI18n } from '$lib/../i18n';
	import { waitLocale } from 'svelte-i18n';

	export async function load() {
		initI18n();
		waitLocale();
		return {};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { blockW, blockH, blockS, spaceS, spaceM, spaceL, field, border } from '$src/store.js';

	let ref;
	onMount(() => {
		const {
			width,
			height,
			paddingTop,
			paddingBottom,
			marginTop,
			marginRight,
			marginBottom,
			marginLeft
		} = window.getComputedStyle(ref);
		blockW.set(parseInt(width));
		blockH.set(parseInt(height));
		blockS.set(parseInt(paddingTop));
		field.set(parseInt(paddingBottom));
		spaceS.set(parseInt(marginTop));
		spaceM.set(parseInt(marginRight));
		spaceL.set(parseInt(marginBottom));
		border.set(parseInt(marginLeft));
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
		width           100%
		height          100%
		display         flex
		flex-direction  column
		align-items     center
	
	#ref
		width $SizeBlock
		height $SizeBlock
		padding-top $SizeBlockSmall
		padding-bottom $SizeField
		margin $SpacingSmall $Spacing $SpacingLarge $WidthBorder

</style>
