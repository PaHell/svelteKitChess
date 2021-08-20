import { Chess } from 'chess.js';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default class {
	constructor(fen) {
		this.load(fen ? fen : DEFAULT_FEN);
	}

	load(fen) {
		this.fen = fen;
		this.chess = new Chess(fen);
	}

	getPieces() {
		const pieces = [];
		this.chess.board().forEach((tileRow, y) => {
			tileRow.forEach((tile, x) => {
				if (tile) pieces.push({
					type: tile.color === 'w'
						? tile.type.toUpperCase()
						: tile.type,
					pos: [x, y],
					index: x + 8 * y,
					color: tile.color,
				});
			});
		});
		return pieces;
	}

	getMoves() {
		return this.chess.moves({verbose: true}).reduce((arr, val) => {
			const fromXY = tileToXY(val.from),
			        toXY = tileToXY(val.to),
			       index = fromXY[0] + 8 * fromXY[1];
			const moveType = getMoveType(val.flags);
			if (!arr[index]) {
				arr[index] = {
					moves: [],
					captures: [],
				};
			}
			arr[index][moveType].push({
				from: fromXY,
				to: toXY,
				index,
				san: val.san,
				flag: val.flags,
				captured: val.captured,
				piece: val.piece
			});
			return arr;
		}, []);
	}

	getThreats() {
		const fenArr = this.chess.fen().split(' ');
		fenArr[1] = fenArr[1] === 'w' ? 'b' : 'w';
		const opponent = new Chess(fenArr.join(' '));
		return opponent.moves({verbose: true}).reduce((arr, val) => {
			const fromXY = tileToXY(val.from),
			        toXY = tileToXY(val.to),
			       index = toXY[0] + 8 * toXY[1];
			const moveType = getMoveType(val.flags);
			if (!arr[index]) {
				arr[index] = [];
			}
			if (getMoveType(val.flags) === 'captures') {
				arr[index].push({
					from: fromXY,
					to: toXY,
					index,
					san: val.san,
					flag: val.flags,
					captured: val.captured,
					piece: val.piece
				});
			}
			return arr;
		}, []);
	}

	move(san) {
		this.chess.move(san);
		console.log(this.chess.ascii());
		console.log(san, this.chess.fen());
	}

}

// private functions

function getMoveType(flag) {
	switch(flag) {
		case 'n':
		case 'b':
		case 'p':
		case 'k':
		case 'q':
			return 'moves';
		case 'c':
		case 'e':
			return 'captures';
	}
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