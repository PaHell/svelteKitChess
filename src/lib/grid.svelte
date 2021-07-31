<script context="module">
	// cursor
	import Cursor from '$lib/grid/cursor.svelte';
	// components
	import button from '$lib/grid/button.svelte';
	import checkbox from '$lib/grid/checkbox.svelte';
	import input from '$lib/grid/input.svelte';
	import select from '$lib/grid/select.svelte';
	import text from '$lib/grid/text.svelte';
	const elementTypes = {
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
	import { onMount } from 'svelte';
	import { cellWidth, cellHeight, cellSpacing } from '../store.js';
	import { objToCss } from '../helpers.js';

	export let elements = false;
	export let layout = false;

	let data = [];
	let activeElemID = 0;
	let cursorShown = true;

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
			.map((w) => `${w * ($cellWidth + $cellSpacing) - $cellSpacing}px`)
			.join(' ')};
		grid-template-rows: ${gridRows
			.map((h) => `${h * ($cellHeight + $cellSpacing) - $cellSpacing}px`)
			.join(' ')};
	`;

	// ON MOUNT
	onMount(() => {
		setTimeout(() => {
			generateCSS();
		}, 0);
	});

	const getElemID = (x, y) => Object.keys(elements).indexOf(gridAreas[y][x]);

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

	function getOrder(index, length) {
		const result = [index];
		for (let radius = 1; radius <= length - 1; radius++) {
			result.push(index - radius);
			result.push(index + radius);
		}
		return result;
	}

	function getNearbyElements(id) {
		const verticalOrder = getOrder(data[id].mid.y, gridHeight);
		const horizontalOrder = getOrder(data[id].mid.x, gridWidth);
		const checkValidAndSave = (x, y, dir) => {
			const elemID = getElemID(x, y);
			if (elemID !== -1 && elemID !== id && !data[elemID].skip) {
				data[id][dir] = elemID;
				return true;
			}
			return false;
		};
		// right
		forRight: {
			let height = data[id].y[1] - data[id].y[0];
			for (let x = data[id].x[1] + 1; x < gridWidth; x++) {
				for (let y = 0; y <= height; y++) {
					_searches++;
					if (verticalOrder[y] > -1 && verticalOrder[y] < gridHeight) {
						if (checkValidAndSave(x, verticalOrder[y], 'right')) break forRight;
					}
				}
				height += 2;
			}
		}
		// left
		forLeft: {
			let height = data[id].y[1] - data[id].y[0];
			for (let x = data[id].x[0] - 1; x >= 0; x--) {
				for (let y = 0; y <= height; y++) {
					_searches++;
					if (verticalOrder[y] > -1 && verticalOrder[y] < gridHeight) {
						if (checkValidAndSave(x, verticalOrder[y], 'left')) break forLeft;
					}
				}
				height += 2;
			}
		}
		// up
		forUp: {
			let width = data[id].x[1] - data[id].x[0];
			for (let y = data[id].y[0] - 1; y >= 0; y--) {
				for (let x = 0; x <= width; x++) {
					_searches++;
					if (horizontalOrder[x] > -1 && horizontalOrder[x] < gridWidth) {
						if (checkValidAndSave(horizontalOrder[x], y, 'up')) break forUp;
					}
				}
				width += 2;
			}
		}
		// down
		forDown: {
			let width = data[id].x[1] - data[id].x[0];
			for (let y = data[id].y[1] + 1; y < gridHeight; y++) {
				for (let x = 0; x <= width; x++) {
					_searches++;
					if (horizontalOrder[x] > -1 && horizontalOrder[x] < gridWidth) {
						if (checkValidAndSave(horizontalOrder[x], y, 'down')) break forDown;
					}
				}
				width += 2;
			}
		}
	}

	function getOffset(startX, startY) {
		const offset = {
			top: 0,
			left: 0
		};
		for (let y = 0; y < startY; y++) {
			offset.top += gridRows[y];
		}
		for (let x = 0; x < startX; x++) {
			offset.left += gridColumns[x];
		}
		return offset;
	}

	function getSize(x, y) {
		const size = {
			width: 0,
			height: 0
		};
		for (let _y = y[0]; _y <= y[1]; _y++) {
			size.height += gridRows[_y];
		}
		for (let _x = x[0]; _x <= x[1]; _x++) {
			size.width += gridColumns[_x];
		}
		return size;
	}

	function generateCSS() {
		data.forEach((element, index) => {
			const offset = getOffset(element.x[0], element.y[0]);
			const size = getSize(element.x, element.y);
			element.css = objToCss({
				'margin-top': offset.top * ($cellHeight + $cellSpacing),
				'margin-left': offset.left * ($cellWidth + $cellSpacing),
				width: size.width * ($cellWidth + $cellSpacing) - $cellSpacing,
				height: size.height * ($cellHeight + $cellSpacing) - $cellSpacing
			});
			// get the following out of here
			element.mid = {
				y: Math.floor(element.y[0] + 0.5 * (element.y[1] - element.y[0])),
				x: Math.floor(element.x[0] + 0.5 * (element.x[1] - element.x[0]))
			};
			getNearbyElements(index);
		});
	}

	function setActiveElem(event, elemID) {
		data[activeElemID].ref.onLeave?.(event);
		activeElemID = elemID;
		data[activeElemID].ref.onEnter?.(event);
		cursorShown = !data[activeElemID].ref?.hideCursor;
	}

	function onClick(event, elemID) {
		if (elemID !== activeElemID) setActiveElem(event, elemID);
		data[activeElemID].ref.onClick?.(event);
	}

	function handleKeydown(event) {
		const keyCodesDir = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};
		const compResponse = data[activeElemID].ref.handleKeydown?.(event);
		if (!compResponse) {
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
		cursorShown = !data[activeElemID].ref?.hideCursor;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<template lang="pug">
	.grid(style="{gridCSS}")
		Cursor(style="{data[activeElemID].css}", shown="{cursorShown}")
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
