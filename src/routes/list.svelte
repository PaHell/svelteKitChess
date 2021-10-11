<script>
	import Grid from '$lib/grid.svelte';
	let gridElements = {
		L1: {
			type: 'list',
			text: 'Cache',
			icon: 'memory',
			items: [
				{
					text: 'Lorem'
				},
				{
					text: 'Ipsum'
				},
				{
					text: 'Dolor'
				},
				{
					text: 'Sit'
				},
				{
					text: 'Amet'
				},
				{
					text: 'Et'
				},
				{
					text: 'Dolore'
				},
				{
					text: 'Amen'
				},
				{
					text: 'Lorem'
				},
				{
					text: 'Lorem'
				},
				{
					text: 'Lorem'
				},
				{
					text: 'Lorem'
				},
				{
					text: 'Lorem'
				},
				{
					text: 'Lorem'
				}
			],
			callback: (item, index) => {
				console.log('LIST ITEM CALLBACK', index, item);
			},
			autofocus: true
		}
	};
	// 12:8 format
	// prettier-ignore
	let gridLayout = [
		[ 0, 2    , 2    , 2    , 2    ],
		[ 3, 'L1' , 'L1' , 'L1' , 'L1' ],
		[ 3, 'L1' , 'L1' , 'L1' , 'L1' ],
		[ 2, 'L1' , 'L1' , 'L1' , 'L1' ],
	];
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>
