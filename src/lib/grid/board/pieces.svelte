<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Piece from '$lib/grid/board/piece.svelte';
</script>

<script>
	export let pieces = [];
	export let moves = [];
	export let threats = [];
	export let active;

	const dispatch = createEventDispatcher();
</script>

<template lang="pug">
	#pieces
		+each('pieces as piece')
			Piece(
				piece="{piece}",
				moves="{moves[piece.index]}",
				threats="{threats[piece.index]}",
				active="{active === piece.index}",
				on:click!="{() => dispatch('click', piece)}",
			)
</template>

<style lang="stylus" global>
	#pieces
		padding $WidthBorder 0 0 $WidthBorder
</style>
