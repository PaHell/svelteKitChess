<script>
	import UI from '$lib/ui.svelte';

	let elements = {
		list: {
			type: 'text',
			icon: 'memory',
			text: 'game.board_settings.headline',
			level: 'headline'
		},
		button: {
			type: 'button',
			text: 'code',
			icon: 'vpn_key',
			value: '/'
		},
		button2: {
			type: 'button',
			text: 'code',
			icon: 'vpn_key',
			value: '/',
			autofocus: 'true',
		},
		input: {
			type: 'input',
			value: '',
			label: 'game.board_settings.fen',
			name: 'code',
			placeholder: 'game.board_settings.fen_placeholder',
			icon: 'vpn_key',
		}
	};
	// prettier-ignore
	const layouts = {
		xs: [
			' input->  button ',
			' button2  list-> ',
			'     .    list-> ',
			'     .    list-> ',
			'     .    list-> ',
		],
		s: [
			'input-> ',
			'list . button-w1',
			'list button2',
			'list '
		],
		m: [
			'input <> button-w1',
			'list button2',
			'list '
		],
		l: [
			'input . button-w4',
			'list button2'
		],
		xl: [
			'input button button2',
			'list->'
		]
	};
</script>

<template lang="pug">
	UI(bind:elements="{elements}", bind:layouts="{layouts}")
</template>
