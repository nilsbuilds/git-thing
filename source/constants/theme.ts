// Terminal colors: black, red, green, yellow, blue, magenta, cyan, white, gray
// Or hex: #ff0000, rgb: rgb(255,0,0)

export const theme = {
	// Heading
	heading: {
		text: 'BRANCHES',
		color: 'blue',
		bold: true,
		// Border: 'single', 'double', 'round', 'bold', 'classic', 'singleDouble', 'doubleSingle'
		borderStyle: 'double' as const,
		borderColor: 'blue',
		paddingX: 2, // horizontal padding inside box
		paddingY: 0, // vertical padding inside box
		marginBottom: 0, // space below heading
	},

	// Branch list
	branch: {
		currentColor: 'green',
		selectedColor: 'blue',
		selectedBold: true,
	},

	// Help text
	help: {
		dimmed: true,
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
	},

	// Tabs
	tabs: {
		activeColor: 'cyan',
		inactiveColor: 'gray',
	},
}
