import { Chess } from 'chess.js';
import sfEngine from './sfEngine.js';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default class {
	#fen = '';
	// instances
	#chess = undefined;
	#sf = undefined;
	// data
	#pieces = [];
	#moves = [];
	constructor(fen) {
		this.load(fen);
	}

	load(fen) {
		this.#fen = fen ? fen : DEFAULT_FEN;
		this.#chess = new Chess(fen);
		this.#pieces = [];
		this.#moves = [];
	}

	getPieces() {
		const pieces = [];
		this.#chess.board().forEach((tileRow, y) => {
			tileRow.forEach((tile, x) => {
				if (tile)
					pieces.push({
						type: tile.type,
						pos: [x, y],
						index: x + 8 * y,
						color: tile.color
					});
			});
		});
		this.#pieces = pieces;
		return pieces;
	}

	getMoves() {
		return this.#chess.moves({ verbose: true }).reduce((arr, val) => {
			const fromXY = tileToXY(val.from),
				toXY = tileToXY(val.to),
				index = fromXY[0] + 8 * fromXY[1];
			if (!arr[index]) {
				arr[index] = [];
			}
			arr[index].push({
				from: fromXY,
				to: toXY,
				index: toXY[0] + 8 * toXY[1],
				san: val.san,
				lan: [
					val.from,
					//val.flags.includes('c') ? 'x' : '-',
					val.to,
					val.flags.includes('p') ? '=' : ''
				].join(''),
				flags: val.flags,
				type: getMoveType(val.flags),
				captured: val.captured,
				piece: val.piece,
				color: val.color
			});
			return arr;
		}, []);
	}

	getThreats() {
		const fenArr = this.#chess.fen().split(' ');
		fenArr[1] = fenArr[1] === 'w' ? 'b' : 'w';
		const opponent = new Chess(fenArr.join(' '));
		return opponent.moves({ verbose: true }).reduce((arr, val) => {
			const fromXY = tileToXY(val.from),
				toXY = tileToXY(val.to),
				index = toXY[0] + 8 * toXY[1];
			const moveType = getMoveType(val.flags);
			if (!arr[index]) {
				arr[index] = [];
			}
			if (getMoveType(val.flags) === 'capture') {
				arr[index].push({
					from: fromXY,
					to: toXY,
					index,
					san: val.san,
					flags: val.flags,
					captured: val.captured,
					piece: val.piece
				});
			}
			return arr;
		}, []);
	}

	move(lan) {
		// do move in engine
		const move = this.#chess.move(lan, { sloppy: true });
		console.log('MOVE', move);

		// add to moves
		this.#moves.push(lan);

		// PROCESS CHANGES
		const fromXY = tileToXY(move.from);
		const toXY = tileToXY(move.to);
		const fromIndex = fromXY[0] + fromXY[1] * 8;
		const toIndex = toXY[0] + toXY[1] * 8;
		const pIndex = this.#pieces.findIndex((p) => p.index === fromIndex);
		const changes = [
			[
				pIndex,
				{
					index: toIndex,
					pos: toXY
				}
			]
		];
		console.log(this.#chess.ascii());
		console.log(lan, this.#chess.fen());
		switch (move.flags) {
			// en passant capture
			case 'e':
				{
					const index = toXY[0] + 8 * fromXY[1];
					const pieceID = this.#pieces.findIndex((p) => p.index === index);
					const y = this.#pieces[pieceID].color === 'w' ? -1 : 8;
					changes.push([
						pieceID,
						{
							index: -1,
							pos: [7, y]
						}
					]);
				}
				break;
			// q castling
			case 'q':
				{
					const index = 8 * fromXY[1];
					const pieceID = this.#pieces.findIndex((p) => p.index === index);
					const towerXY = [toXY[0] + 1, fromXY[1]];
					console.log('q', pieceID, towerXY);
					changes.push([
						pieceID,
						{
							index: towerXY[0] + 8 * towerXY[1],
							pos: towerXY
						}
					]);
				}
				break;
			// k castling
			case 'k':
				{
					const index = 7 + 8 * fromXY[1];
					const pieceID = this.#pieces.findIndex((p) => p.index === index);
					const towerXY = [toXY[0] - 1, fromXY[1]];
					console.log('k', pieceID, towerXY);
					changes.push([
						pieceID,
						{
							index: towerXY[0] + 8 * towerXY[1],
							pos: towerXY
						}
					]);
				}
				break;
			// promotion and/or normal capture
			default: {
				if (move.flags.includes('c')) {
					const pieceID = this.#pieces.findIndex((p) => p.index === toIndex);
					const y = this.#pieces[pieceID].color === 'w' ? -1 : 8;
					changes.push([
						pieceID,
						{
							index: -1,
							pos: [7, y]
						}
					]);
				}
				if (move.flags.includes('p')) {
					changes.push([
						pIndex,
						{
							type: move.promotion
						}
					]);
				}
			}
		}
		return changes;
	}

	async getBestMove(difficulty) {
		if (!this.#sf) {
			this.#sf = new sfEngine();
			this.#sf.load(this.#fen, difficulty);
		}
		return this.#sf.getBestMove(this.#moves, difficulty);
	}
}

// private functions

function getMoveType(flags) {
	switch (flags) {
		case 'n':
		case 'b':
		case 'k':
		case 'q':
			return 'move';
		case 'e':
		case 'c':
			return 'capture';
		default:
			if (flags.includes('c')) return 'capture';
			if (flags.includes('p')) return 'promotion';
	}
	return 'none';
}

function tileToXY(tile) {
	return ['abcdefgh'.indexOf(tile[0]), 8 - parseInt(tile[1])];
}

function isNumeric(char) {
	return /^\d+$/.test(char);
}

function isLetter(char) {
	return /^[A-Za-z]+$/.test(char);
}
