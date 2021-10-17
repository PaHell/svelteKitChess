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
		[ 's',  4, 1],
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
	let activeBP = 0;
	let gridAreas = [];
	let gridCols = [];
	let gridRows = [];
	let gridStyle = '';
	$: gridStyle = `
		grid-template-areas: "${gridAreas
			.reduce((acc, curr) => {
				acc.push(curr.join(' '));
				return acc;
			}, [])
			.join('" "')}";
		grid-template-columns: ${gridCols
			.reduce((acc, curr) => {
				acc.push(curr.length ? curr : `${curr * ($blockW + $spaceL) - $spaceL}px`);
				return acc;
			}, [])
			.join(' ')};
		grid-template-rows: ${gridRows
			.reduce((acc, curr) => {
				acc.push(curr.length ? curr : `${curr * ($blockH + $spaceL) - $spaceL}px`);
				return acc;
			}, [])
			.join(' ')};
	`;
	let elemSpecs = {};
	let _mountResolve;
	let mountPromise = new Promise((resolve) => {
		_mountResolve = resolve;
	});

	// name of active elem
	let activeElem = '';
	// cursor
	let cursorStyle = { w: 0, h: 0, x: 0, y: 0 };
	let cursorTrans = { w: 0, h: 0, x: 0, y: 0 };

	onMount(() => {
		// find focused element
		activeElem = Object.keys(elements).find((name) => elements[name].autofocus);
		console.log('autofocus:', { activeElem }, '=>', { elem: elements[activeElem] });
		setTimeout(() => {
			// enable after mount functions
			_mountResolve();
			// init layout
			handleResize();
		}, 500);
	});

	// FUNCTIONS

	function handleKeydown({ keyCode }) {
		console.log('handle keydown:', { keyCode });
		const [fromX, toX] = elemSpecs[activeElem].grid.x;
		const [fromY, toY] = elemSpecs[activeElem].grid.y;
		switch (keyCode) {
			case 37: {
				// left
				console.log('	=> right', { fromX, fromY, fromY });
				if (isElem(x - 1, fromY)) {
					const left = gridAreas[fromY][fromX - 1];
					console.log('	=> ', { left });
					activeElem = left;
					updateCursor();
				}
				break;
			}
			case 39: {
				// right
				console.log('	=> right', { toX, fromY, fromY });
				if (isElem(fromX + 1, fromY)) {
					const right = gridAreas[fromY][toX + 1];
					console.log('	=> ', { right });
					activeElem = right;
					updateCursor();
				}
				break;
			}
			case 38: {
				// up
				break;
			}
			case 40: {
				// down
				break;
			}
		}
	}

	function handleResize() {
		console.log('handleResize');
		recalcTemplate();
		recalcSpecs();
		updateCursor();
	}

	function updateCursor() {
		mountPromise.then(() => {
			console.log('updating cursor');
			console.log('	=> func:', { ref: Object.keys(refs[activeElem]).join(' ') });
			cursorStyle = elemSpecs[activeElem].px;
			console.log('	=> cursor:', { ...cursorStyle });
		});
	}

	function isElem(x, y) {
		if (x < 0 || y < 0) return false;
		switch (gridAreas[y][x]) {
			case '.':
				return false;
			default:
				return true;
		}
	}

	function recalcSpecs() {
		mountPromise.then(() => {
			elemSpecs = {};
			const w = activeBP[1];
			const h = layouts[activeBP[0]].length;
			console.log('set elem specs', { w, h });
			for (let y = 0; y < h; y++) {
				for (let x = 0; x < w; x++) {
					const name = gridAreas[y][x];
					if (!elements[name]) {
						console.log('	=> no elem found for', name, x, y);
					} else if (!elemSpecs[name]) {
						const n = nodes[name];
						// create entry
						elemSpecs[name] = {
							grid: {
								x: [x, x],
								y: [y, y],
								w: 1,
								h: 1
							},
							px: {
								w: n.clientWidth,
								h: n.clientHeight,
								x: n.offsetLeft,
								y: n.offsetTop
							}
						};
						console.log('	=> new entry:', name);
					} else {
						// update entry
						const [fromX, toX] = elemSpecs[name].grid.x;
						const [fromY, toY] = elemSpecs[name].grid.y;
						elemSpecs[name].grid = {
							x: [x < fromX ? x : fromX, x > toX ? x : toX],
							y: [y < fromX ? y : fromX, y > toX ? y : toX],
							w: toX - fromX + 1,
							h: toY - fromY + 1
						};
					}
				}
			}
		});
	}

	function parseTemplateValue(strVal, defaultWidth) {
		const args = strVal.split('-');
		const elem = args[0];
		const obj = {
			name: elem,
			width: defaultWidth,
			flex: false
		};
		if (args.length > 1) {
			for (let i = 1; i < args.length; i += 1) {
				const val = args[i].substr(1, args.length - 1);
				const arg = args[i].charAt(0);
				switch (arg) {
					case 'w':
						obj.width = parseInt(val);
						break;
					case '>':
						obj.flex = true;
						obj.width = 1;
						break;
				}
			}
		} else {
			switch (elem) {
				case '<>':
					obj.name = '.';
					obj.width = 0;
					obj.flex = true;
					break;
				case '.':
					obj.width = 1;
					break;
			}
		}
		return obj;
	}

	function parseTemplateRow(strRow, [name, width, defaultWidth]) {
		// parse Array and filter empty
		const values = strRow.split(' ').filter((n) => n.length);
		const widthElems = values.reduce((acc, curr) => {
			// todo: optimize call
			acc += parseTemplateValue(curr, defaultWidth).width;
			return acc;
		}, 0);
		const arrElems = values.reduce((acc, curr) => {
			const parsed = parseTemplateValue(curr, defaultWidth);
			let toFill = 0;
			if (parsed.flex) toFill = width - widthElems;
			acc.push(...Array(parsed.width + toFill).fill(parsed.name));
			return acc;
		}, []);
		// fill rows to width
		const missingWidth = width - arrElems.length;
		if (missingWidth > 0) arrElems.push(...Array(missingWidth).fill('.'));
		return arrElems;
	}

	function getBreakpoint() {
		console.log('get breakpoint');
		const w = Math.trunc((window.innerWidth - $spaceL) / ($blockW + $spaceL));
		console.log('	=> windowWidth:', w);
		let bp = breakpoints[0];
		breakpoints.forEach(([key, value, defaultW]) => {
			if (bp[1] < value && value <= w) {
				bp = [key, value, defaultW];
			}
		});
		console.log('	=> chosen:', bp);
		return bp;
	}

	function recalcTemplate() {
		console.log('recalc template');
		activeBP = getBreakpoint();
		const [layoutName, width, defaultW] = activeBP;
		const layout = layouts[layoutName];
		gridAreas = [];
		for (let y = 0; y < layout.length; y++) {
			const parsed = parseTemplateRow(layout[y], activeBP);
			gridAreas.push(parsed);
		}
		if (width === breakpoints[0][1]) gridCols = [1, 'minmax(0, 1fr)', 1];
		else gridCols = Array(width).fill(1);
		gridRows = Array(layout.length).fill(1);
	}
</script>

<!-- prettier-ignore -->
<svelte:window
	on:keydown="{throttle(handleKeydown, 2)}"
	on:resize="{debounce(handleResize, 256)}"
/>

<template lang="pug">
	.ui(style="{gridStyle}", class="{`layout-${activeBP[0]}`}")
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
						bind:specs="{elemSpecs[name]}",
						active="{ activeElem === name }",
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
