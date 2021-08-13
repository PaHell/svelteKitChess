<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { blockS, field, border } from '$src/store.js';
	import Icon from '$lib/icon.svelte';
</script>

<script>
	export let active;
	export let props;
	const defaults = {
		pieces: new Map(),
		captured: {},
		turn: -1,
		playing: -1,
		players: []
	};
	props = { ...defaults, ...props };
	const dispatch = createEventDispatcher();
	const size = 8;
	const board = [];
	let hovered = 0;
	const pieceValues = {
		p: 1,
		n: 3,
		b: 3,
		r: 5,
		q: 9
	};
	let capturedSum;
	$: capturedSum = Object.keys(props.captured).reduce((counter, key) => {
		counter[/[A-Z]/.test(key) ? 0 : 1] += pieceValues[key.toLowerCase()] * props.captured[key]; 
		return counter;
	}, [0, 0]);
	let capturedPiecesSplit;
	$: capturedPiecesSplit = Object.keys(pieceValues).reduce((counter, key) => {
		counter[0].push(props.captured[key.toUpperCase()] || 0); 
		counter[1].push(props.captured[key] || 0); 
		return counter;
	}, [[], []]);
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			board.push({
				x,
				y,
				color: (y % 2 && x % 2) || (!(y % 2) && !(x % 2)) ? 'white' : 'black',
				index: x + y * 8
			});
		}
	}
	export function onEnter() {
		updateCursor();
	}
	export function handleKeydown(event) {
		let parentStop = false;
		switch (event.keyCode) {
			case 38: // up
				if (hovered > size - 1) {
					hovered -= size;
					parentStop = true;
				}
				break;
			case 40: // down
				if (hovered < Math.pow(size, 2) - size) {
					hovered += size;
					parentStop = true;
				}
				break;
			case 37: // left
				if (hovered % size) {
					hovered--;
					parentStop = true;
				}
				break;
			case 39: // right
				if (hovered % size !== size - 1) {
					hovered++;
					parentStop = true;
				}
				break;
			case 13: // enter
				console.log('enter:', hovered, board[hovered].x, board[hovered].y);
				break;
		}
		updateCursor();
		return parentStop;
	}
	function updateCursor() {
		dispatch('cursor', {
			x: $blockS + ($field + $border) * (hovered % size),
			y: 2 * $blockS + ($field + $border) * Math.trunc(hovered / size),
			w: $field + 2 * $border,
			h: $field + 2 * $border
		});
	}
	function onPieceClick(event, piece) {
		hovered = piece.pos;
		updateCursor();
		dispatch('click', event);
	}
</script>

<template lang="pug">
	.container-board
		+each('Array(2) as _null, i')
			.info.flex(style="{`grid-area: info${i}`}")
				.tabs.player
					.flex.name(
						class:turn="{props.turn === 1 - i}",
						class:playing="{props.playing === 1 - i}")
						Icon { props.players[i].type === 'c' ? 'memory' : 'person' }
						p.text.bold { props.players[i].name }
					.flex.level
						+if('props.players[i].type !== "c"')
							p.text.bold { $_('game.board.level') }
						p.text.bold { props.players[i].level }
				.tabs.captured
					+each('Object.keys(pieceValues) as key, index')
						.piece.flex(class:show="{capturedPiecesSplit[i][index]}")
							p.text.bold { capturedPiecesSplit[i][index] }
							img(src="{`pieces/${i === 0 ? key.toUpperCase() : key}.svg`}")
					.sum.flex(class:show="{capturedSum[i]}")
						p.text.bold { capturedSum[i] }
						p.text.bold { $_('game.board.points') }
			.legend.row(style="{`grid-area: row${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { size-i }
			.legend.col(style="{`grid-area: col${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { String.fromCharCode(65 + i) }
		.board(class:active)
			+each('board as field, index')
				.field(class="{field.color}", class:hovered="{index === hovered}")
		.pieces
			+each('[...props.pieces.values()] as piece')
				.container
					button(
						on:click!="{e => onPieceClick(e, piece)}",
						class:captured="{piece.pos === -1}",
						style!="{`margin:\
							${Math.trunc(piece.pos / size) * ($field + $border)}px\
							0\
							0\
							${(piece.pos % size) * ($field + $border)}px\
						;`}")
						img(src="{`pieces/${piece.type}.svg`}")
</template>

<style lang="stylus" global>
	$SizeBoard = (8 * ($SizeField + $WidthBorder) + $WidthBorder)
	
	.tabs
		overflow         hidden
		display          flex
		align-content    center
		height           100%
		border           $WidthBorder solid $ColorBorder
		border-radius    $Radius
		background-color $ColorBorder
		
		> *
			height           100%
			border-radius    $RadiusSmall - $WidthBorder
			background-color $ColorBG
			
			> .text
				line-height .65 * $FZ_Text
			
			&:not(:last-child)
				margin-right $WidthBorder
				
			&:first-child
				border-top-left-radius    $Radius - $WidthBorder
				border-bottom-left-radius $Radius - $WidthBorder
					
			&:last-child
				border-top-right-radius    $Radius - $WidthBorder
				border-bottom-right-radius $Radius - $WidthBorder
	
	.container-board
		overflow              visible !important
		display               grid
		grid-template-areas   ".      info0  .   "\
                              "pieces col0   .   "\
		                      "row0   board  row1"\
		                      ".      col1   .   "\
		                      ".      info1  .   "
		grid-template-columns $SizeBlockSmall $SizeBoard $SizeBlockSmall
		grid-template-rows    $SizeBlockSmall $SizeBlockSmall $SizeBoard $SizeBlockSmall $SizeBlockSmall
		width                 100%
		height                100%
		background-color      transparent !important
		box-shadow            none !important
		position              static !important
		
		> .info
			justify-content space-between
			
			> .player
				overflow visible
				
				> .name
					position         relative
					padding          0 $Spacing 0 $SpacingSmall
					background-color $ColorBGLight
					transition       box-shadow $TimeTrans
					
					> *:not(:last-child)		
						margin-right $SpacingText
						
					> .icon
						width        $FZ_IconSmall
						font-size    $FZ_IconSmall
						line-height  $FZ_IconSmall
						
					&.turn
						box-shadow $ShadowRaised
					
						>.icon
							color $ColorAccentIcon
						
				>.level
					padding 0 $Spacing
				
					> .text
						margin-top     0
						text-transform uppercase
						
						&:not(:last-child)
							margin-right $SpacingText
						&:first-child
							color $ColorBlackTextTri
						&:last-child
							color $ColorBlackTextSec
			
			> .captured
				> .piece
					overflow        hidden
					width           0
					margin-right    0
					transition      width $TimeTrans
					will-change     width
					
					&.show
						width .7 * $FZ_Text + $WidthBorder + $SizeBlockSmall + $WidthBorder
						margin-right $WidthBorder
						
					> .text
						width        .7 * $FZ_Text
						margin-right $WidthBorder
						color        $ColorBlackTextTri
						text-align   right
						
					> img
						width        $SizeBlockSmall - 2 * $WidthBorder - 9px
						margin       0 $WidthBorder 2px 0
						opacity      $OpacityBlackTri
				
				> .sum
					padding    0 $Spacing
					transition background-color $TimeTrans
					
					> .text
						margin         0
						line-height    .65 * $FZ_Text
						text-transform uppercase
						
						&:not(:last-child)
							margin-right $SpacingText
						
						&:first-child
							color $ColorBlackTextSec
						&:last-child
							color $ColorBlackTextTri
					&.show
						background-color $ColorBGLight
						
						> .text
							&:first-child
								color $ColorBlackTextPri
		> .legend
			
			> .text
				text-align center
				color      $ColorBlackTextTri
			
			&.col
				display flex
				
				> .text
					width        $SizeField + $WidthBorder
					height       $SizeBlockSmall
					line-height  $SizeBlockSmall + 2 * $LHC
					margin-right $WidthBorder
					
					&:first-child
						margin-left $WidthBorder
			
			&.row
				display        flex
				flex-direction column
				> .text
					width         $SizeBlockSmall
					height        $SizeField + $WidthBorder
					line-height   $SizeField + 2 * $LHC
					margin-bottom $WidthBorder
					
					&:first-child
						margin-top $WidthBorder
		> .board
			grid-area             board
			display               grid
			grid-template-columns repeat(8, $SizeField)
			grid-template-rows    repeat(8, $SizeField)
			grid-gap              $WidthBorder
			background-color      $ColorBorder
			border                $WidthBorder solid $ColorBorder
			border-radius         $Radius + $WidthBorder
			
			> .field
				border-radius $RadiusSmall
				transition    box-shadow $TimeTrans
				// testing
				//line-height   $SizeField
				//text-align    center
				
				&:nth-child(1)
					border-top-left-radius $Radius
				&:nth-child(8)
					border-top-right-radius $Radius
				&:nth-child(57)
					border-bottom-left-radius $Radius
				&:nth-child(64)
					border-bottom-right-radius $Radius
				
				&.white
					background-color $ColorBGLight
					
				&.black
					background-color $ColorBG
				
				&.hovered
					position    relative
					color       $ColorAccent
					font-weight $FW_Bold
			
			&.active > .field.hovered
				box-shadow $ShadowRaised
				
		> .pieces
			grid-area pieces
			width     $SizeBoard
			height    $SizeBoard
			margin    $SizeBlockSmall 0 0 $SizeBlockSmall
			padding   $WidthBorder 0 0 $WidthBorder
			position  relative
			
			> .container
				width  0
				height 0
			
				> button
					width            $SizeField
					height           $SizeField
					//background-color red
					border-radius    $Radius
					transition       margin $TimeTrans, opacity $TimeTrans
					
					> img
						width 100%
						height 100%
						padding $Spacing
			
					&.captured
						opacity 0
				
</style>