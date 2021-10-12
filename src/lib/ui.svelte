<script context="module">
	import { debounce, throttle } from '$src/helpers';
	// cursor
	import Cursor from '$lib/grid/cursor.svelte';
	// components
	const elementTypes = {
		board: {
			component: import('./grid/board.svelte')
		},
		list: {
			component: import('./grid/list.svelte')
		},
		button: {
			component: import('./grid/button.svelte')
		},
		checkbox: {
			component: import('./grid/checkbox.svelte')
		},
		input: {
			component: import('./grid/input.svelte')
		},
		select: {
			component: import('./grid/select.svelte')
		},
		text: {
			component: import('./grid/text.svelte'),
			skip: true
		}
	};

	// prettier-ignore
	const breakpoints = [
		['xs',  3],
		[ 's',  4],
		[ 'm',  7],
		[ 'l', 10],
		['xl', 15],
	];
</script>

<script>
	// IMPORTS
	import { onMount } from 'svelte';
	import { blockW, blockH, spaceL } from '$src/store.js';
	// PROPS
	export let elements = [];
	export let layouts = [];
	// DATA
	let refs = {};
	let nodes = {};
	let layoutName = '';
	let gridAreas = [];
	let gridCols = [];
	let gridRows = [];
	let gridStyle = '';
	$: gridStyle = `
		grid-template-areas: "${
			gridAreas.reduce((acc, curr) => {
				acc.push(curr.join(' '));
				return acc;
			}, []).join('" "')
		}";
		grid-template-columns: ${
			gridCols.reduce((acc, curr) => {
				acc.push(
					curr.length
					? curr
					: `${curr * ($blockW + $spaceL) - $spaceL}px`
				);
				return acc;
			}, []).join(' ')
		};
		grid-template-rows: ${
			gridRows.reduce((acc, curr) => {
				acc.push(
					curr.length
					? curr
					: `${curr * ($blockH + $spaceL) - $spaceL}px`
				);
				return acc;
			}, []).join(' ')
		};
	`;

	let activeElem = '';
	let cursorStyle = { w: 0, h: 0, x: 0, y: 0 };
	let cursorTrans = { w: 0, h: 0, x: 0, y: 0 };

	onMount(() => {
		setTimeout(() => {
			// init layout
			handleResize();
			// find focused element
			for (const [key, val] of Object.entries(elements)) {
				if (val.autofocus) {
					activeElem = key;
					break;
				}
			}
			console.log('autofocus:', {activeElem});
		}, 0);
	});

	// FUNCTIONS

	function handleKeydown({keyCode}) {
		console.log({keyCode});
		switch (keyCode) {
			case 37: { // left
				break;
			}
			case 39: { // right
				break;
			}
			case 38: { // up
				break;
			}
			case 40: { // down
				break;
			}
		}
	}

	function handleResize() {
		console.log('handleResize');
		recalcTemplate();
		updateCursor();
	}

	async function updateCursor() {
		setTimeout(() => {
			console.log(refs[activeElem]);
			const n = nodes[activeElem];
			cursorStyle = {
				w: n.clientWidth,
				h: n.clientHeight,
				x: n.offsetLeft,
				y: n.offsetTop,
			}
		}, 1000);
	}

	function parseTemplateRow(strRow, width) {
		// parse Array and filter empty
		const values = strRow.split(' ').filter((n) => n.length);
		const widthElems = values.reduce((acc, curr) => {
			const argW = curr.split('-').find(arg => arg.charAt(0) === 'w');
			const valW = argW?.substr(1);
			if (valW) {
				console.log('adding width', valW);
				acc += parseInt(valW);
			} else acc += 1;
		}, 0);
		// parse args
		const argsResolved = values.reduce((acc, curr) => {
			const split = curr.split('-');
			const name = split[0];
			if (split.length > 1) {
				const args = split.splice(1);
				args.forEach((arg) => {
					const key = arg.charAt(0);
					const val = arg.substr(1, arg.length);
					switch (key) {
						case 'w': // width
							acc.push(...Array(parseInt(val)).fill(name));
							break;
						case '>': // flex
							console.log('> push', {width, widthElems});
							acc.push(...Array(width - widthElems).fill(name));
							break;
						}
				});
			} else acc.push(name);
			return acc;
		}, []);
		// parse symbols
		const symbolsResolved = argsResolved.reduce((acc, curr, idx) => {
			console.log({curr, width});
			switch(curr) {
				case '<>': {
					const flex = width - argsResolved.length + 1;
					console.log(' =>', curr, 'adding', flex, '.');
					if (flex > 0) acc.push(...(Array(flex).fill('.')));
					break;
				}
				case '>': {
					const flex = width - argsResolved.length + 1;
					console.log(' =>', curr, 'adding', flex, argsResolved[idx - 1]);
					if (flex > 0) acc.push(...(Array(flex).fill(argsResolved[idx - 1])));
					break;
				}
				default:
					acc.push(curr);
			}
			return acc;
		}, []);
		// fill rows to width
		const fillWidth = width - symbolsResolved.length;
		if (fillWidth > 0) {
			symbolsResolved.push(...(Array(width - symbolsResolved.length).fill('.')));
		}
		return symbolsResolved;
	}

	async function recalcTemplate() {
		let map = breakpoints;
		let bp = map[0];
		let w = Math.trunc((window.innerWidth - $spaceL) / ($blockW + $spaceL));
		for (const [key, value, unit] of map) {
			if (bp[1] < value && value <= w) {
				bp = [key, value, unit];
			}
		}
		w = bp[1];
		layoutName = bp[0];
		const layout = layouts[bp[0]];
		gridAreas = [];
		for (let y = 0; y < layout.length; y++) {
			const parsed = parseTemplateRow(layout[y], w);
			gridAreas.push(parsed);
		}
		w <= breakpoints[0][1]
			? gridCols = [1, 'minmax(0, 1fr)', 1]
			: gridCols = Array(w).fill(1);
		gridRows = Array(layout.length).fill(1);
	}

</script>

<!-- prettier-ignore -->
<svelte:window
	on:keydown="{throttle(handleKeydown, 250)}"
	on:resize="{debounce(handleResize, 250)}"
/>

<template lang="pug">
	.ui(style="{gridStyle}", class="{`layout-${layoutName}`}")
		+if('activeElem.length')
			Cursor(style="{cursorStyle}")
				//, transform="{currentCursorTransform}")
		+each('Object.entries(elements) as [name, elem], i')
			.cell(
				bind:this="{nodes[name]}",
				style="{`grid-area: ${name};`}")
				+await('elementTypes[elem.type].component then comp')
					svelte:component(
						this="{comp.default}",
						bind:this="{refs[name]}",
						bind:props="{elem}",
						active="{ activeElem === i }",
					)
</template>

<style lang="stylus" global>
	.ui
		display             grid
		grid-gap            $SpacingLarge
		padding             $SizeBlock $SpacingLarge
		//transform           rotateX(-45deg) rotateY(0) rotateZ(30deg)
		//transform-style     preserve-3d
		//backface-visibility hidden
			
		&.layout-xs
			width    100%
			padding  $Spacing
			grid-gap $Spacing

		> .cell
			> *
				overflow         hidden
				position         relative
				z-index          12
				background-color $ColorBG
				border-radius    $Radius
				box-shadow       $Shadow
				transition       background-color $TimeTrans, box-shadow $TimeTrans
				
				&.active
					z-index          18
					background-color $ColorBGLight
					box-shadow       $ShadowRaised
			
				&[disabled]
					border           $WidthBorder dashed $ColorBorder
					border-radius    $Radius
					box-shadow       none
					background-color $ColorBG
</style>
