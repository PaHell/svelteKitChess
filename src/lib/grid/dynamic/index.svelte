<script context="module">
	const templates = {
		small: import('./small.svelte'),
		big: import('./big.svelte'),
		fallback: import('./fallback.svelte')
	};

	async function loadComponent(name) {
		return templates.hasOwnProperty(name) ? templates[name] : templates.fallback;
	}
</script>

<script>
	export let template;
	export let prop;
</script>

<template lang="pug">
	+await('loadComponent(template) then comp')
		svelte:component(this="{comp.default}", bind:prop="{prop}")
</template>

<style lang="stylus" global>

</style>
