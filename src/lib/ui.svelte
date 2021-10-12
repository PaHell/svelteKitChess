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
		// size, cols, defaultColumnWidth
		['xs',  3, 1],
		[ 's',  4, 2],
		[ 'm',  6, 3],
		[ 'l', 10, 5],
		['xl', 15, 5],
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

	function parseTemplateRow(strRow, [name, width, defaultWidth]) {
		console.log('--- PARSE TEMPLATE ROW ---');
		// parse Array and filter empty
		const values = strRow.split(' ').filter((n) => n.length);
		// calc pure elems with without flex, only width and spaces (.)
		const widthElems = values.reduce((acc, curr) => {
			switch (curr) {
				case '<>':
					break;
				case '.':
					acc += 1;
					break;
				default:
					const split = curr.split('-');
					const argWidth = split.find(arg => arg.charAt(0) === 'w')?.substr(1);
					const argFlex = split.find(arg => arg.charAt(0) === '>');
					if (argWidth) {
						acc += parseInt(argWidth);				
					} else if (argFlex) {
						acc += 1;
					} else acc += defaultWidth;
			}
			console.log('calc width:', {acc, curr});
			return acc;
		}, 0);
		console.log('parse row', {str: strRow, widthElems, layout: name, defaultWidth});
		if (width < widthElems) console.log('  -> longer than layout', name);
		// parse args
		const argsResolved = values.reduce((acc, curr) => {
			switch (curr) {
				case '<>':
				case '.':
					acc.push(curr);
					break;
				default:
					const split = curr.split('-');
					const name = split[0];
					let widthResolved = false;
					if (split.length > 1) {
						const args = split.splice(1);
						args.forEach((arg) => {
							const key = arg.charAt(0);
							const val = arg.substr(1, arg.length);
							switch (key) {
								case 'w': // width
									console.log(`  -> item-w "${name}"`, {width: parseInt(val)});
									acc.push(...Array(parseInt(val)).fill(name));
									widthResolved = true;
									break;
								case '>': // flex
									console.log(`  -> item-> "${name}"`, {width: width - widthElems + 1});
									if (width - widthElems + 1 > 0) {
										acc.push(...Array(width - widthElems + 1).fill(name));
										widthResolved = true;
									} else console.log('  -> can\'t flex')
									break;
							}
						});
					}
					if (!widthResolved) acc.push(...Array(defaultWidth).fill(name));
			}
			return acc;
		}, []);
		// parse symbols
		console.log('PARSE SYMBOLS');
		console.log(argsResolved);
		const symbolsResolved = argsResolved.reduce((acc, curr, idx) => {
			console.log(' > symbol', idx, curr, '->', acc);
			switch(curr) {
				case '<>': {
					const flex = width - widthElems;
					console.log('  ->', curr, 'adding', flex, '.');
					if (flex > 0) {
						console.log(' -> space-between', curr);
						acc.push(...(Array(flex).fill('.')));
					}
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
		for (const [key, value, defaultW] of map) {
			if (bp[1] < value && value <= w) {
				bp = [key, value, defaultW];
			}
		}
		w = bp[1];
		layoutName = bp[0];
		console.log('LAYOUT:', layoutName);
		const layout = layouts[bp[0]];
		gridAreas = [];
		for (let y = 0; y < layout.length; y++) {
			const parsed = parseTemplateRow(layout[y], bp);
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
