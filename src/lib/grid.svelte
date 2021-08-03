<script context="module">
	// cursor
	import Cursor from '$lib/grid/cursor.svelte';
	// components
	import button from '$lib/grid/button.svelte';
	import board from '$lib/grid/board.svelte';
	import checkbox from '$lib/grid/checkbox.svelte';
	import input from '$lib/grid/input.svelte';
	import select from '$lib/grid/select.svelte';
	import text from '$lib/grid/text.svelte';
	const elementTypes = {
		board: {
			component: board
		},
		button: {
			component: button
		},
		checkbox: {
			component: checkbox
		},
		input: {
			component: input
		},
		select: {
			component: select
		},
		text: {
			component: text,
			skip: true
		}
	};
</script>

<script>
	// IMPORTS
	import { onMount } from 'svelte';
	import { blockW, blockH, spaceL } from '$src/store.js';
	// PROPS
	export let elements = false;
	export let layout = false;
	// DATA
	let data = [];
	let activeElemID = 0;
	let currentCursorTransform = { x: 0, y: 0 };
	let cursorShown = false;
	// grid specs
	let gridWidth = layout[0].length - 1;
	let gridHeight = layout.length - 1;
	let gridColumns = layout[0].splice(1);
	let gridRows = [...layout].splice(1).map((h) => h[0]);
	let gridAreas = [...layout].splice(1).map((h) => [...h].splice(1));
	// stat
	let _searches = 0;
	$: {
		console.log('total searches:', _searches);
		console.log('Ø searches per elem per direction', _searches / data.length / 4);
	}
	// css
	let gridCSS;
	$: gridCSS = `
		grid-template-areas: "${gridAreas.map((row) => [...row].join(' ')).join('" "')}";
		grid-template-columns: ${gridColumns
			.map((w) => `${w * ($blockW + $spaceL) - $spaceL}px`)
			.join(' ')};
		grid-template-rows: ${gridRows
			.map((h) => `${h * ($blockH + $spaceL) - $spaceL}px`)
			.join(' ')};
	`;
	// START
	// fill data object
	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			// assign ID based on order in elements arr
			const cell = gridAreas[y][x];
			const elemID = Object.keys(elements).indexOf(cell);
			if (elemID === -1) {
				if (cell !== '.') console.log('no elem found for', cell, x, y);
			} else if (!data[elemID]) {
				// create entry
				data[elemID] = {
					name: cell,
					type: elements[cell].type,
					ref: undefined, // component reference
					skip: elementTypes[elements[cell].type].skip,
					x: [x, x],
					y: [y, y],
					css: ''
				};
				//console.log('created entry:', elemID, '|', data[elemID].name);
			} else {
				// update entry
				data[elemID].x = [
					x < data[elemID].x[0] ? x : data[elemID].x[0],
					x > data[elemID].x[1] ? x : data[elemID].x[1]
				];
				data[elemID].y = [
					y < data[elemID].y[0] ? y : data[elemID].y[0],
					y > data[elemID].y[1] ? y : data[elemID].y[1]
				];
			}
		}
	}
	// generate offset, size and directions
	data.forEach((element, index) => {
		const verticalOrder = getOrder(
			Math.ceil(element.y[0] + 0.5 * (element.y[1] - element.y[0])),
			gridHeight
		);
		const horizontalOrder = getOrder(
			Math.ceil(element.x[0] + 0.5 * (element.x[1] - element.x[0])),
			gridWidth
		);
		//console.warn(element.name);
		const checkValid = (elemID) => elemID !== -1 && elemID !== index && !data[elemID].skip;
		// right
		forRight: {
			let height = data[index].y[1] - data[index].y[0];
			for (let x = data[index].x[1] + 1; x < gridWidth; x++) {
				for (let y = 0; y <= height; y++) {
					_searches++;
					const elemID = getElemID(x, verticalOrder[y]);
					if (checkValid(elemID)) {
						data[index].right = elemID;
						break forRight;
					}
				}
				height += 2;
			}
		}
		//console.log('-> right:', data[index].right);
		// left
		forLeft: {
			let height = data[index].y[1] - data[index].y[0];
			for (let x = data[index].x[0] - 1; x >= 0; x--) {
				for (let y = 0; y <= height; y++) {
					_searches++;
					const elemID = getElemID(x, verticalOrder[y]);
					if (checkValid(elemID)) {
						data[index].left = elemID;
						break forLeft;
					}
				}
				height += 2;
			}
		}
		//console.log('-> left:', data[index].left);
		// up
		forUp: {
			let width = data[index].x[1] - data[index].x[0];
			for (let y = data[index].y[0] - 1; y >= 0; y--) {
				for (let x = 0; x <= width; x++) {
					_searches++;
					const elemID = getElemID(horizontalOrder[x], y);
					if (checkValid(elemID)) {
						data[index].up = elemID;
						break forUp;
					}
				}
				width += 2;
			}
		}
		//console.log('-> up:', data[index].up);
		// down
		forDown: {
			let width = data[index].x[1] - data[index].x[0];
			for (let y = data[index].y[1] + 1; y < gridHeight; y++) {
				for (let x = 0; x <= width; x++) {
					_searches++;
					const elemID = getElemID(horizontalOrder[x], y);
					if (checkValid(elemID)) {
						data[index].down = elemID;
						break forDown;
					}
				}
				width += 2;
			}
		}
		//console.log('-> down:', data[index].down);
		const { x, y } = getOffset(element.x[0], element.y[0]);
		const { w, h } = getSize(element.x, element.y);
		element.css = { y, x, w, h };
	});
	cursorShown = true;
	// FUNCTIONS
	function getElemID(x, y) {
		if (y > gridHeight - 1 || x > gridWidth - 1 || y < 0 || x < 0) return -1;
		return Object.keys(elements).indexOf(gridAreas[y][x]);
	}
	function getOrder(index, length) {
		const result = [index];
		for (let radius = 1; radius <= length - 1; radius++) {
			result.push(index - radius, index + radius);
		}
		return result;
	}
	function getOffset(startX, startY) {
		const offset = {
			y: 0,
			x: 0
		};
		for (let y = 0; y < startY; y++) {
			offset.y += gridRows[y];
		}
		for (let x = 0; x < startX; x++) {
			offset.x += gridColumns[x];
		}
		return offset;
	}
	function getSize(x, y) {
		const size = {
			w: 0,
			h: 0
		};
		for (let _y = y[0]; _y <= y[1]; _y++) {
			size.h += gridRows[_y];
		}
		for (let _x = x[0]; _x <= x[1]; _x++) {
			size.w += gridColumns[_x];
		}
		return size;
	}
	function setActiveElem(event, elemID) {
		data[activeElemID].ref.onLeave?.(event);
		activeElemID = elemID;
		currentCursorTransform = { x: 0, y: 0 };
		data[activeElemID].ref.onEnter?.(event);
	}
	function onClick(event, elemID) {
		if (elemID !== activeElemID) setActiveElem(event, elemID);
		data[activeElemID].ref.onClick?.(event);
		currentCursorTransform = { x: 0, y: 0 };
	}
	function handleKeydown(event) {
		const keyCodesDir = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};
		//console.warn(event.keyCode);
		const compResponse = data[activeElemID].ref.handleKeydown?.(event);
		if (compResponse?.cursor) currentCursorTransform = compResponse.cursor;
		if (compResponse === undefined || compResponse?.continue) {
			switch (event.keyCode) {
				// dir
				case 37:
				case 38:
				case 39:
				case 40:
					event.preventDefault();
					const newActiveElemID = data[activeElemID][keyCodesDir[event.keyCode]];
					if (newActiveElemID !== undefined) setActiveElem(event, newActiveElemID);
					break;
				// enter key
				case 13:
					event.preventDefault();
					if (!elements[data[activeElemID].name].disabled) onClick(event, activeElemID);
					break;
				default:
				//console.log('keyCode', event.keyCode);
			}
		}
	}
</script>
<svelte:window on:keydown={handleKeydown} />
<template lang="pug">
	.grid(style="{gridCSS}")
		+if('{cursorShown}')
			Cursor(
				style="{data[activeElemID].css}",
				transform="{currentCursorTransform}")
		+each('data as element, i')
			.cell(style="{`grid-area: ${element.name};`}")
				svelte:component(
					this="{elementTypes[element.type].component}",
					bind:props="{elements[element.name]}",
					bind:this="{element.ref}",
					active="{activeElemID === i}",
					on:click!="{(e) => onClick(e, i)}")
</template>
<style lang="stylus" global>
	.grid
		display             grid
		grid-auto-rows      $SizeBlock
		grid-auto-columns   2 * $SizeBlock
		grid-gap            $SpacingLarge
		//padding             $SizeBlockSmall
		//box-sizing          content-box
		//transform           rotateX(-45deg) rotateY(0) rotateZ(30deg)
		//transform-style     preserve-3d
		//backface-visibility hidden
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