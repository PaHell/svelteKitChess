<svelte:options accessors={true} />

<script context="module">
	import { createEventDispatcher } from 'svelte';
	import Iconify from '@iconify/svelte';
	import { _ } from 'svelte-i18n';
	import { blockS, field, border } from '$src/store.js';
	import Icon from '$lib/icon.svelte';
	import Piece from '$lib/grid/piece.svelte';
	import Move from '$lib/grid/move.svelte';
	import PieceIcon from '$lib/grid/pieceIcon.svelte';
</script>

<script>
	export let active;
	export let props;
	const defaults = {
		pieces: [],
		turn: -1,
		playing: -1,
		players: []
	};
	props = { ...defaults, ...props };
	const dispatch = createEventDispatcher();
	const size = 8;
	const board = [];
	let hovered = 0;
	let activePieceIndex = -1;
	const pieceValues = {
		p: 1,
		n: 3,
		b: 3,
		r: 5,
		q: 9
	};
	let hoveredPromotion = -1;
	let lastPromotionMove = undefined;
	const piecesPromotion = ['n', 'b', 'r', 'q'];
	let capturedSum;
	$: capturedSum = capturedPiecesSplit.reduce(
		(arr, obj) => {
			let count = 0;
			Object.keys(obj).forEach(key => {
				count += obj[key] * pieceValues[key];
			});
			arr.push(count);
			return arr;
		},
		[]
	);
	let capturedPiecesSplit;
	$: capturedPiecesSplit = props.pieces.reduce(
		(counter, piece) => {
			if (piece.index === -1) {
				const i = piece.color === 'w' ? 0 : 1;
				counter[i][piece.type] = ++counter[i][piece.type] || 1;
			}
			return counter;
		},
		[{},{}]
	);

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			board.push({
				x,
				y,
				color: (y % 2 && x % 2) || (!(y % 2) && !(x % 2)) ? 'white' : 'black',
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
				if (hoveredPromotion !== -1) {
					hoveredPromotion = -1;
					parentStop = true;
				} else if (hovered > size - 1) {
					hovered -= size;
					parentStop = true;
					updateCursor();
				}
				break;
			case 40: // down
				if (hoveredPromotion !== -1) {
					hoveredPromotion = -1;
					parentStop = true;
				} else if (hovered < Math.pow(size, 2) - size) {
					hovered += size;
					parentStop = true;
					updateCursor();
				}
				break;
			case 37: // left
				if (hoveredPromotion !== -1) {
					hoveredPromotion = hoveredPromotion !== 0
						? hoveredPromotion - 1
						: piecesPromotion.length;
					parentStop = true;
				} else if (hovered % size > 0) {
					hovered--;
					parentStop = true;
					updateCursor();
				}
				break;
			case 39: // right
				if (hoveredPromotion !== -1) {
					hoveredPromotion = hoveredPromotion !== piecesPromotion.length
						? hoveredPromotion + 1
						: 0;
					parentStop = true;
				} else if (hovered % size !== size - 1) {
					hovered++;
					parentStop = true;
					updateCursor();
				}
				break;
			case 13: // enter
				if (hoveredPromotion !== -1) performPromotion(hoveredPromotion);
				else if (activePieceIndex !== -1) {
					const move = props.moves[activePieceIndex].find(move => move.index === hovered);
					if (move !== undefined) {
						performMove(move);
						break;
					}
				}
				setActivePiece(event, getPiece(hovered));
				break;
		}
		return parentStop;
	}

	function getPiece(pIndex) {
		return props.pieces.find(({index}) => index === pIndex);
	}

	function updateCursor() {
		dispatch('cursor', {
			x: $blockS + ($field + $border) * (hovered % size),
			y: 2 * $blockS + ($field + $border) * Math.trunc(hovered / size),
			w: $field + 2 * $border,
			h: $field + 2 * $border
		});
	}

	function setActivePiece(event, piece) {
		if (piece && props.moves[piece.index]) {		
			hovered = piece.index;
			if(activePieceIndex !== piece.index) activePieceIndex = piece.index;
			else activePieceIndex = -1;
			updateCursor();
			dispatch('click', event);
		}
	}

	export function performMove(move) {
		console.table({
			algebraic: move.san,
			from: `(${move.from.join('|')})`,
			to: `(${move.to.join('|')})`,
			indexTo: move.index,
			desc: `${move.flag} ${move.type} with ${move.piece}`,
			type: move.type
		});
		if (move.type === 'promotion' && hoveredPromotion === -1) {
			lastPromotionMove = move;
			hoveredPromotion = 0;
		} else {
			hovered = move.index;
			activePieceIndex = -1;
			updateCursor();
			dispatch('event', move);
		}
	}

	function performPromotion(index) {
		if (index !== piecesPromotion.length) {
			const move = {
				...lastPromotionMove,
				lan: lastPromotionMove.lan + piecesPromotion[index],
			};
			performMove(move);
			console.warn('do Promo', move.lan);
		}
		// close
		hoveredPromotion = -1;
	}
</script>

<template lang="pug">
	#board
		+each('Array(2) as _null, i')
			.info.flex(
				style="{`grid-area: info${i}`}",
				class="{i === 0 ? 'b' : 'w'}")
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
					+each('Object.keys(pieceValues) as key')
						.piece.flex(class:show="{capturedPiecesSplit[i][key]}")
							p.text.bold { capturedPiecesSplit[i][key] }
							PieceIcon(
								type="{key}",
								color="{i === 0 ? 'w' : 'b'}")
					.sum.flex(class:show="{capturedSum[i]}")
						p.text.bold { capturedSum[i] }
						p.text.bold { $_('game.board.points') }
			.legend.row(style="{`grid-area: row${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { size-i }
			.legend.col(style="{`grid-area: col${i}`}")
				+each('Array(size) as _, i')
					p.text.caption.bold { String.fromCharCode(65 + i) }
		.container(class:active)
			.layer
				#fields
					+each('board as field, index')
						.field(
							class="{field.color}",
							class:active="{activePieceIndex === index}")
							p.text.caption
								span {String.fromCharCode(index%8 + 65)}{8 - Math.trunc(index/8)}
			.layer
				#pieces
					+each('props.pieces as piece')
						Piece(
							piece="{piece}",
							moves="{props.moves[piece.index]}",
							threats="{props.threats[piece.index]}",
							active="{activePieceIndex === piece.index}",
							on:click!="{e => setActivePiece(e, piece)}",
						)
			.layer
				#moves
					+if('activePieceIndex !== -1')
						+each('props.moves[activePieceIndex] as move')
							Move(
								props="{move}",
								on:click!="{() => performMove(move)}"
							)
			.layer
				#promotion(class:show!="{hoveredPromotion > -1}")
					header.flex
						Icon star
						p.text.caption.bold Promote Pawn to:
					main.flex
						+each('piecesPromotion as piece, index')
							button(
								class:active="{index === hoveredPromotion}",
								on:click!="{() => performPromotion(index)}"
							)
								PieceIcon(type="{piece}", color="w")
						button(
							class:active="{piecesPromotion.length === hoveredPromotion}",
							on:click!="{() => performPromotion(piecesPromotion.length)}",
						)
							Icon close
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
	
	#board
		overflow              visible !important
		display               grid
		grid-template-areas   ".      info0 .   "\
                              ".      col0  .   "\
		                      "row0   ct    row1"\
		                      ".      col1  .   "\
		                      ".      info1 .   "
		grid-template-columns $SizeBlockSmall $SizeBoard $SizeBlockSmall
		grid-template-rows    $SizeBlockSmall $SizeBlockSmall $SizeBoard $SizeBlockSmall $SizeBlockSmall
		width                 100%
		height                100%
		background-color      transparent !important
		box-shadow            none !important
		position              static !important
		
		> .info
			justify-content space-between
			
			&.w > .player > .name > .icon
				color $ColorPlayerWhite[1]
			&.b > .player > .name > .icon
				color $ColorPlayerBlack[1]
			
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
						
					> .piece-icon
						width        $SizeBlockSmall - 2 * $WidthBorder - 9px
						height       $SizeBlockSmall - 2 * $WidthBorder - 9px
						margin-right $WidthBorder
				
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
						
		> .container
			grid-area ct
			
			> .layer
				width  0
				height 0
				
				> *
					width  $SizeBoard
					height $SizeBoard

			#fields
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
						>.text
							color $Grey400
						
					&.black
						background-color $ColorBG
						>.text
							color $Grey500
					
					&.active
						position relative
					
					> .text
						margin $SpacingSmall
				
				&.active > .field.active
					box-shadow $ShadowRaised
					
			#pieces
				padding $WidthBorder 0 0 $WidthBorder	

			#moves
				padding $WidthBorder 0 0 $WidthBorder	

				> .move
					width  $SizeField
					height $SizeField
			
			#promotion
				width            5 * $SizeField + 4 * $WidthBorder
				height           $SizeField + $SizeBlockSmall + $WidthBorder
				position         relative
				background-color $ColorBorder
				box-shadow       $ShadowRaised
				border-radius    $Radius
				opacity          0
				transform        scale(0)
				transition       transform $TimeTrans, opacity $TimeTrans
				
				&.show
					opacity   1
					transform scale(1)
				
				> header
					margin-bottom    $WidthBorder
					border-radius    $Radius $Radius $RadiusSmall $RadiusSmall
					background-color $ColorBG
					
					> .icon
						color       $Amber[1]
						font-size   $FZ_IconSmall
						line-height $SizeBlockSmall
					
					> .text
						margin-left $SpacingText
						color       $ColorBlackTextSec
				
				> main
					overflow         hidden
					border-radius    $RadiusSmall $RadiusSmall $Radius $Radius

					> button
						width            $SizeField
						height           $SizeField
						padding          $Spacing
						background-color $ColorBGLight
						border-radius    $RadiusSmall
						
						&:not(:first-child)
							margin-left $WidthBorder
						
						> .icon
							font-size   $FZ_IconLarge
							color       $ColorIconPri
							line-height ($SizeField - 2 * $Spacing)
						
						&.active
							background-color $Red[1]
</style>
