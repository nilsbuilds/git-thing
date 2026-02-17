import React, {useState} from 'react'
import {Box, Text, useInput} from 'ink'

type NavigationInfoProps = {
	shortcuts: string[]
	isActive: boolean
}

export function NavigationInfo({shortcuts, isActive}: NavigationInfoProps) {
	const [showInfo, setShowInfo] = useState(false)

	useInput(
		(input, key) => {
			if (input === 'i') {
				setShowInfo((v) => !v)
			} else if (!key.shift) {
				setShowInfo(false)
			}
		},
		{isActive},
	)

	return (
		<Box flexDirection="column" marginTop={1}>
			{showInfo ? (
				shortcuts.map((shortcut) => (
					<Text key={shortcut} dimColor>
						{shortcut}
					</Text>
				))
			) : (
				<Text dimColor>Press i for info</Text>
			)}
		</Box>
	)
}
