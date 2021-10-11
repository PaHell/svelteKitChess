<script context="module">
	console.log('fallback module');
</script>

<script>
	import { onMount } from 'svelte';
	export let prop;

	onMount(() => {
		console.log('fallback mounted');
	});
</script>

<template lang="pug">
	p.text.bold Fallback: { prop }
</template>
