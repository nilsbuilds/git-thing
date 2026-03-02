// Terminal colors: black, red, green, yellow, blue, magenta, cyan, white, gray
// Or hex: #ff0000, rgb: rgb(255,0,0)

export const theme = {
	// Branch list
	branch: {
		currentColor: 'green',
		selectedColor: 'blue',
		selectedBold: true,
	},

	// Errors
	error: {
		color: 'red',
	},

	// Modes
	modes: {
		selection: {
			label: 'Selection',
			color: 'blue',
		},
		rebase: {
			label: 'Rebase Master',
			color: 'magenta',
		},
		settings: {
			label: 'Settings',
			color: 'cyan',
		},
	},

	// Status messages
	status: {
		successColor: 'green',
		errorColor: 'red',
		updateColor: 'yellow',
	},

	// Tabs
	tabs: {
		activeColor: 'cyan',
		inactiveColor: 'gray',
	},
}
