import { writable } from 'svelte/store';

export const blockW = writable(0);
export const blockH = writable(0);
export const blockS = writable(0);
export const field = writable(0);
export const border = writable(0);
export const spaceM = writable(0);
export const spaceS = writable(0);
export const spaceL = writable(0);

export const lastGameConfig = writable({
	fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	//fen: '1nb1kbn1/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1',
	difficulty: 0,
	captured: {},
	turn: 0,
	iam: 0,
	players: [
		{
			type: 'c',
			name: 'Stockfish 12',
			level: 'Hard'
		},
		{
			type: 'p',
			name: 'David Noah',
			level: '420'
		}
	]
});
