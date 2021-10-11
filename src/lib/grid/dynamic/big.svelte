<script>
	import { onMount } from 'svelte';
	export let prop;

	onMount(() => {
		console.log('big mounted');
	});
</script>

<template lang="pug">
	p.text.bold Big: { prop }
</template>
