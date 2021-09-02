export default class {

	depth;
	#moves = [];
	#bestmoveResolve;
	#engine = {
		promise: undefined,
		resolve: undefined,
		reject: undefined,
	};
	#instance;
	#fen = '';

	constructor() {
		const self = this;
		// Create Engine Promise
		this.#engine.promise = new Promise((resolve, reject) => {
			this.#engine.resolve = resolve;
			this.#engine.reject = reject;
		});
		if (typeof Stockfish) {
			// create stockfish.wasm
			Stockfish().then((sf) => {
				self.instance = sf;
				sf.addMessageListener((msg) => self.onMessage(msg));
				sf.postMessage('uci');
				//sf.postMessage('setoption name UCI_AnalyseMode value true');
				//sf.postMessage('setoption name Analysis Contempt value Off');
				//sf.postMessage('setoption name Threads value 4');
				//sf.postMessage('setoption name Hash value 512');
				sf.postMessage('setoption name Skill Level value 20');
			});
		} else {
			this.#engine.reject('Stockfish not available');
		}
	}

	onMessage(msg) {
		const arr = msg.split(' ');
		switch(arr[0]) {
			case 'uciok':
				console.log('sf onMsg uciok / engine ready');
				this.#engine.resolve();
				break;
			case 'bestmove':
				console.log('sf onMsg bestmove:', arr[1]);
				this.#bestmoveResolve(arr[1]);
				break;
			case '':
			case 'id':
			case 'option':
				console.log('sf ignore');
				break;
			case 'info':
				console.log(`%c${msg}`, 'color: green;');
				break;
			default:
				console.log({sf: arr});
		}
	}

	send(msg) {
		return new Promise(async (resolve, reject) => {
			await this.#engine.promise;
			this.instance.postMessage(msg);
			resolve();
		});
	}

	load(fen, moves, depth = 1) {
		this.depth = depth;
		this.#moves = moves;
		this.#fen = fen;
		this.send('ucinewgame');
		console.table({
			title: 'load sfEngine',
			fen,
			moves,
			depth
		});
		this.send(`position fen ${fen} moves ${this.#moves.join(' ')}`);
	}

	getBestMove(move, depth = this.depth) {
		this.#moves.push(move);
		return new Promise(async (resolve, reject) => {
			await this.send(`position fen ${this.#fen} moves ${this.#moves.join(' ')}`);
			await this.send(`go depth ${depth}`);
			this.#bestmoveResolve = resolve;
		});
	}
}
