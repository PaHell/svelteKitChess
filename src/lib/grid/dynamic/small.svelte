<script>
	import { onMount } from 'svelte';
	export let prop;

	onMount(() => {
		console.log('small mounted');
	});
</script>

<template lang="pug">
	p.text.bold Small: { prop }
</template>
