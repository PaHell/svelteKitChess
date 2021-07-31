<script>
	import Grid from '$lib/grid.svelte';
	let gridElements = {
		back: {
			type: 'button',
			icon: 'arrow_back',
			value: '/settings'
		},
		heading: {
			type: 'text',
			text: 'Privacy Policy',
			icon: 'security',
			level: 'heading'
		},
		text: {
			type: 'text',
			text: 'Content',
			level: 'text'
		}
	};
	// prettier-ignore
	let gridLayout = [
		[ 0, 1     , 12       , 1   ], // 14:8 
		[ 1, 'back', 'heading', '.' ],
		[ 7, '.'   , 'text'   , '.' ],
	];
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>

<style lang="stylus">

</style>
