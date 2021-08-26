import { Chess } from 'chess.js';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default class {
	constructor(fen) {
		this.load(fen ? fen : DEFAULT_FEN);
	}

	load(fen) {
		this.fen = fen;
		this.chess = new Chess(fen);
		this.pieces = [];
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
		this.pieces = pieces;
		return pieces;
	}

	getMoves() {
		return this.chess.moves({verbose: true}).reduce((arr, val) => {
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
				lan: `${val.from}${val.to}`,
				flag: val.flags,
				type: getMoveType(val.flags),
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
			if (getMoveType(val.flags) === 'capture') {
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
		const move = this.chess.move(san, { sloppy: true });
		const fromXY = tileToXY(move.from);
		const toXY = tileToXY(move.to);
		const fromIndex = fromXY[0] + fromXY[1] * 8;
		const toIndex = toXY[0] + toXY[1] * 8;
		const pIndex = this.pieces.findIndex(p => p.index === fromIndex);
		const changes = [[pIndex, {
			index: toIndex,
			pos: toXY,
		}]];
		console.log(this.chess.ascii());
		console.log(san, this.chess.fen());
		switch(move.flags) {
			// normal capture on target
			case 'c': {
				const pieceID = this.pieces.findIndex(p => p.index === toIndex);
				const y = this.pieces[pieceID].color === 'w' ? -1 : 8;
				changes.push([pieceID, {
					index: -1,
					pos: [7, y],
				}]);
			}
			break;
			// en passant capture
			case 'e': {
				const index = toXY[0] + 8 * fromXY[1];
				const pieceID = this.pieces.findIndex(p => p.index === index);
				const y = this.pieces[pieceID].color === 'w' ? -1 : 8;
				changes.push([pieceID, {
					index: -1,
					pos: [7, y],
				}]);
			}
			break;
			// q castling
			case 'q': {
				const index = 8 * fromXY[1];
				const pieceID = this.pieces.findIndex(p => p.index === index);
				const towerXY = [toXY[0] + 1, fromXY[1]];
				console.log('q', pieceID, towerXY);
				changes.push([pieceID, {
					index: towerXY[0] + 8 * towerXY[1],
					pos: towerXY,
				}]);
			}
			break;
			// k castling
			case 'k': {
				const index = 7 + 8 * fromXY[1];
				const pieceID = this.pieces.findIndex(p => p.index === index);
				const towerXY = [toXY[0] - 1, fromXY[1]];
				console.log('k', pieceID, towerXY);
				changes.push([pieceID, {
					index: towerXY[0] + 8 * towerXY[1],
					pos: towerXY,
				}]);
			}
			break;
			// capture + promotion
			case 'cp': {
				//
			}
			// non-capture + promotion
			case 'np': {
				//
			}
			break;
		}
		return changes;
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
			return 'move';
		case 'c':
		case 'e':
			return 'capture';
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