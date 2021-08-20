export default class {
	constructor(listener) {
		const self = this;
		// VAR
		this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		this.depth;
		this.moves;
		// ENGINE
		this.promise = new Promise((resolve, reject) => {
			//
			if (typeof Stockfish) {
				// create stockfish.wasm
				Stockfish().then((sf) => {
					self.instance = sf;
					sf.addMessageListener(listener);
					sf.postMessage('uci');
					//sf.postMessage('setoption name UCI_AnalyseMode value true');
					//sf.postMessage('setoption name Analysis Contempt value Off');
					//sf.postMessage('setoption name Threads value 4');
					//sf.postMessage('setoption name Hash value 512');
					resolve();
				});
			} else reject();
		});
	}

	async send(msg) {
		this.promise.then(() => this.instance.postMessage(msg));
	}

	new(fen, startingDepth = 1) {
		this.send('ucinewgame');
		this.send(`position fen "${fen}"`);
		this.fen = fen;
		this.depth = startingDepth;
		this.moves = [];
		const position = fen.split(' ')[0];
		let index = 0;
		let pieces = new Map();
		for (let i = 0; i < position.length; i++) {
			const char = position.charAt(i);
			if (parseInt(char)) index += parseInt(char);
			else if (char.charCodeAt(0) > 64) {
				pieces.set(i, {
					type: char,
					pos: index
				});
				index++;
			}
		}
		return pieces;
	}

	isNumeric(char) {
		return /^\d+$/.test(char);
	}

	getPieceByPos(pieceMap, pos) {
		let match = { key: -1, val: { type: undefined, pos } };
		pieceMap.forEach((val, key) => {
			if (val.pos === pos) {
				match = { key, val };
				//break;
			}
		});
		return match;
	}

	bestmove() {
		this.send(`go depth ${this.depth}`);
	}

	move(pieceMap, lan) {
		this.moves.push(lan);
		this.send(`position fen ${this.fen} moves ${this.moves.join(' ')}`);
		//this.send('d');
		const fromTo = Array.from(lan).map((char) =>
			this.isNumeric(char) ? 8 - parseInt(char) : char.charCodeAt(0) - 'a'.charCodeAt(0)
		);
		const from = fromTo[0] + fromTo[1] * 8;
		const to = fromTo[2] + fromTo[3] * 8;
		// RETURN VALUES
		const changes = new Map();
		let flag = false;
		// get Pieces
		const movPiece = this.getPieceByPos(pieceMap, from);
		const capPiece = this.getPieceByPos(pieceMap, to);
		if (movPiece.val.type.toUpperCase() === 'K') console.warn('KING MOVED');
		// move primary piece
		changes.set(movPiece.key, { ...movPiece.val, pos: to });
		if (capPiece.key !== -1) {
			changes.set(capPiece.key, { ...capPiece.val, pos: -1 });
			flag = `captured ${capPiece.val.type}`;
		}
		console.table({
			lan,
			move: `${from} to ${to}`,
			flag,
			changes: [...changes.values()].map((val) => `${val.type} to ${val.pos}`).join(', ')
		});
		// RETURN
		return [changes, flag];
	}
}
