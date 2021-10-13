<script>
	import UI from '$lib/ui.svelte';

	let elements = {
		tChats: {
			type: 'text',
			icon: 'chats',
			text: 'My Chats',
			level: 'headline'
		},
		tChat: {
			type: 'text',
			text: 'Felix Hartmann',
			icon: 'face',
			level: 'headline'
		},
		bMore: {
			type: 'button',
			text: 'More',
			icon: 'more_vert',
			value: '/'
		},
		lChats: {
			type: 'text',
			icon: 'chats',
			text: 'Open Chats',
		},
		lMsgs: {
			type: 'text',
			icon: 'chats',
			text: 'Messages',
		},
		iMsg: {
			type: 'input',
			value: '',
			label: 'Message Content',
			name: 'message',
			placeholder: 'Hello there.',
			icon: 'message',
			autofocus: true,
		},
		bAttach: {
			type: 'button',
			text: 'Attach',
			icon: 'attach_file',
			value: '/'
		},
		bSend: {
			type: 'button',
			text: 'Send',
			icon: 'send',
			value: '/'
		},
	};
	// prettier-ignore
	const layouts = {
		xs: [
			'tChats->',
			'lChats->',
			'tChat-> bMore',
			'lMsgs->',
			'iMsg->',
			'bAttach bSend->'
		],
		s: [
			'tChats->',
			'lChats->',
			'tChat-> bMore',
			'lMsgs->',
			'iMsg-> bAttach bSend'
		],
		m: [
			'tChats->',
			'lChats->',
			'tChat-> bMore-w1',
			'lMsgs->',
			'iMsg-> bAttach-w1 bSend-w1'
		],
		l: [
			'tChats-w3 tChat-> bMore-w2',
			'lChats-w3 lMsgs->',
			' .-w3 iMsg-> bAttach-w1 bSend-w1'
		],
		xl: [
			'tChats tChat-> bMore-w2',
			'lChats lMsgs->',
			' .-w5 iMsg-> bAttach-w1 bSend-w2'
		]
	};
</script>

<template lang="pug">
	UI(bind:elements="{elements}", bind:layouts="{layouts}")
</template>
