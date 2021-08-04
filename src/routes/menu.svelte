<script>
	import Grid from '$lib/grid.svelte';
	let gridElements = {
		back: {
			type: 'button',
			icon: 'arrow_back'
		},
		heading: {
			type: 'text',
			text: 'Play a Game of Chess',
			icon: 'gamepad',
			level: 'heading'
		},
		headline: {
			type: 'text',
			text: 'Headline',
			icon: 'settings'
			//level: 'headline',
		},
		text: {
			type: 'text',
			text: 'Lorem Ipsum Dolor sit Amet.',
			icon: 'text_snippet',
			level: 'text'
		},
		caption: {
			type: 'text',
			text: '2021 Patrick Hellebrand. All rights reserved.',
			icon: 'copyright',
			level: 'caption'
		},
		btn1: {
			type: 'button',
			text: 'Start Game',
			icon: 'play_arrow',
			value: (e) => {
				console.log('custom fn', e);
			}
		},
		link: {
			type: 'button',
			text: 'redesiigner',
			value: 'http://felgrom.redesiigner.com'
		},
		input1: {
			type: 'input',
			value: '',
			label: 'Player 1',
			name: 'given-name',
			placeholder: 'General Grievous',
			icon: 'person'
		},
		input2: {
			type: 'input',
			value: '',
			label: 'Player 2',
			name: 'given-name',
			placeholder: 'General Kenobi',
			icon: 'person'
		},
		input3: {
			type: 'input',
			value: '',
			placeholder: 'Count Doku',
			icon: 'person'
		},
		input4: {
			type: 'input',
			value: '',
			label: 'Player 4',
			placeholder: 'Klaus Heissler'
		},
		toggle: {
			type: 'checkbox',
			text: 'Enable Dark Mode',
			icon: 'dark_mode',
			variant: 'toggle',
			value: true
		},
		checkbox: {
			type: 'checkbox',
			text: 'I accept all the Terms and Conditions',
			value: false
		},
		select: {
			type: 'select',
			label: 'Starting Player',
			icon: 'flag',
			selected: '2',
			options: {
				'1': 'Player 1',
				'2': 'Player 2',
				'3': 'Player 3'
			}
		}
	};
	// prettier-ignore
	let gridLayout = [
		[ 0, 1        , 2         , 1         , 2         ],
		[ 1, 'heading', 'heading' , 'heading' , 'heading' ],
		[ 1, 'back'   , 'headline', 'headline', 'headline'],
		[ 1, 'text'   , 'text'    , 'select'  , 'select'  ],
		[ 1, 'input1' , 'input1'  , 'input2'  , 'input2'  ],
		[ 1, 'input3' , 'input3'  , 'input4'  , 'input4'  ],
		[ 1, 'toggle' , 'toggle'  , 'checkbox', 'checkbox'],
		[ 2, 'btn1'   , 'btn1'    , 'btn1'    , 'btn1'    ],
		[ 1, 'caption', 'caption' , 'link'    , 'link'    ],
	];
</script>

<template lang="pug">
	Grid(bind:elements="{gridElements}", layout="{gridLayout}")
</template>

<style lang="stylus">

</style>
