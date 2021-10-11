<script>
	import UI from '$lib/ui.svelte';

	let elements = {
		list: {
			type: 'text',
			icon: 'memory',
			text: 'game.board_settings.headline',
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
			icon: 'vpn_key'
		}
	};
	// prettier-ignore
	const layouts = {
		xs: [
			' input > button  ',
			' button2  list > ',
			'     #    list > ',
			'     #    list > ',
			'     #    list > ',
		],
		s: [
			' input    > ',
			' list-w2  button  >',
			' list-w2  button2 >',
			' list-w2 '
		],
		m: [
			'input-w4  button  >',
			' list-w4  button2 >',
			' list-w4 '
		],
		l: [
			'  input-w5   button  >',
			'   list-w5 # button2 >'
		],
		xl: [
			'  input-w5 button-w5 button2-w5',
			'   list > '
		]
	};
</script>

<template lang="pug">
	UI(bind:elements="{elements}", bind:layouts="{layouts}")
</template>
