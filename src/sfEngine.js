export default class {
	#bestmoveResolve;
	#engine = {
		promise: undefined,
		resolve: undefined,
		reject: undefined
	};
	#instance;
	#fen = '';
	#skill = 1;
	#depth = 5;

	// prettier-ignore
	#difficulties = [
		{ depth: 15 , skill: 0 , elo: 1350, contempt: 12 },
		{ depth: 5 , skill: 4 , elo: 1750, contempt: 16 },
		{ depth: 5 , skill: 7 , elo: 2250, contempt: 24 },
		{ depth: 5 , skill: 20, elo: 2850, contempt: 32 },
	];

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
				sf.postMessage('setoption name Threads value 2'); // 1-32, 1
				sf.postMessage('setoption name Hash value 512'); // 1-1024, 16
				sf.postMessage('setoption name Slow Mover value 1000'); // 10-1000, 100
				sf.postMessage('setoption name UCI_LimitStrength value true');
				sf.postMessage('setoption name UCI_ShowWDL value true'); // eval of move
				sf.postMessage('setoption name MultiPV value 1'); // 1-500, 1
				//sf.postMessage('setoption name UCI_AnalyseMode value true');
				//sf.postMessage('setoption name Analysis Contempt value Off');
				//sf.postMessage('setoption name UCI_Elo value 1400');
				//sf.postMessage('setoption name Contempt value -100');
			});
		} else {
			this.#engine.reject('Stockfish not available');
		}
	}

	send(msg) {
		return new Promise(async (resolve, reject) => {
			await this.#engine.promise;
			this.instance.postMessage(msg);
			resolve();
		});
	}

	onMessage(msg) {
		const arr = msg.split(' ');
		switch (arr[0]) {
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
				console.log(`%c${msg}`, 'color: gray;');
				break;
			case 'info':
				console.log(`%c${msg}`, 'color: green;');
				break;
			case 'No':
			case 'Unknown':
				console.log(`%c${msg}`, 'color: red;');
				break;
			default:
				console.log({ sf: arr });
		}
	}

	load(fen, difficulty) {
		this.#fen = fen;
		console.table({
			fn: 'sfEngine.load()',
			fen,
			...difficulty
		});
		// load new position without moves
		this.send('ucinewgame');
		this.send(`position fen ${fen}`);
	}

	async applyDifficulty(index) {
		const difficulty = this.#difficulties[index];
		this.#depth = difficulty.depth;
		await this.send(`setoption name UCI_Elo value ${difficulty.elo}`);
		await this.send(`setoption name Skill Level value ${difficulty.skill}`);
		await this.send(`setoption name Contempt value ${difficulty.contempt}`);
	}

	getBestMove(moves, difficulty) {
		return new Promise(async (resolve, reject) => {
			await this.applyDifficulty(difficulty);
			await this.send('ucinewgame');
			await this.send(`position fen ${this.#fen} moves ${moves.join(' ')}`);
			await this.send(`go depth ${this.#depth}`);
			this.#bestmoveResolve = resolve;
		});
	}
}
