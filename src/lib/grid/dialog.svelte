<script context="module">
	import { createEventDispatcher } from 'svelte';
</script>

<script>
	const dispatch = createEventDispatcher();
</script>

<template lang="pug">
	#dialog
		p.text Dialog
</template>

<style lang="stylus" global>
	#dialog
		width            5 * $SizeField + 4 * $WidthBorder
		height           $SizeField + $SizeBlockSmall + $WidthBorder
		position         relative
		background-color $ColorBorder
		box-shadow       $ShadowRaised
		border-radius    $Radius
</style>
