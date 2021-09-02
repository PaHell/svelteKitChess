<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Move from '$lib/grid/board/move.svelte';
</script>

<script>
	export let moves;
	const dispatch = createEventDispatcher();
</script>

<template lang="pug">
	#moves
		+each('moves as move')
			Move(
				props="{move}",
				on:click!="{() => dispatch('click', move)}"
			)
</template>

<style lang="stylus" global>
	#moves
		padding $WidthBorder 0 0 $WidthBorder	

		> .move
			width  $SizeField
			height $SizeField
</style>
