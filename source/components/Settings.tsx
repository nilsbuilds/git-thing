import React, {useState} from 'react'
import {Box, Text, useInput} from 'ink'
import {theme} from '../constants/theme.js'

type SettingsProps = {
	baseBranch: string
	autoStash: boolean
	onBaseBranchChange: (value: string) => void
	onAutoStashChange: (value: boolean) => void
	isActive: boolean
}

type SettingItem = 'baseBranch' | 'autoStash'

export function Settings({
	baseBranch,
	autoStash,
	onBaseBranchChange,
	onAutoStashChange,
	isActive,
}: SettingsProps) {
	const [selectedItem, setSelectedItem] = useState<SettingItem>('baseBranch')
	const [editValue, setEditValue] = useState(baseBranch)
	const [isEditing, setIsEditing] = useState(false)

	const settingItems: SettingItem[] = ['baseBranch', 'autoStash']

	useInput(
		(input, key) => {
			if (isEditing) {
				if (key.return) {
					if (editValue.trim()) {
						onBaseBranchChange(editValue.trim())
					}
					setIsEditing(false)
				} else if (key.escape) {
					setEditValue(baseBranch)
					setIsEditing(false)
				} else if (key.backspace || key.delete) {
					setEditValue((v) => v.slice(0, -1))
				} else if (input && !key.ctrl && !key.meta && !key.tab) {
					setEditValue((v) => v + input)
				}
				return
			}

			if (key.upArrow) {
				const currentIndex = settingItems.indexOf(selectedItem)
				const newIndex = currentIndex > 0 ? currentIndex - 1 : settingItems.length - 1
				setSelectedItem(settingItems[newIndex]!)
			} else if (key.downArrow) {
				const currentIndex = settingItems.indexOf(selectedItem)
				const newIndex = currentIndex < settingItems.length - 1 ? currentIndex + 1 : 0
				setSelectedItem(settingItems[newIndex]!)
			} else if (key.return || input === ' ') {
				if (selectedItem === 'baseBranch') {
					setIsEditing(true)
					setEditValue(baseBranch)
				} else if (selectedItem === 'autoStash') {
					onAutoStashChange(!autoStash)
				}
			}
		},
		{isActive}
	)

	const modeConfig = theme.modes.settings

	return (
		<Box flexDirection="column">
			<Box
				alignSelf="flex-start"
				borderStyle={theme.heading.borderStyle}
				borderColor={modeConfig.color}
				paddingX={theme.heading.paddingX}
				paddingY={theme.heading.paddingY}
				marginBottom={1}
			>
				<Text bold color={modeConfig.color}>
					SETTINGS
				</Text>
			</Box>

			{/* Base Branch setting */}
			<Box>
				<Text color={selectedItem === 'baseBranch' ? modeConfig.color : undefined}>
					{selectedItem === 'baseBranch' ? '▸ ' : '  '}
				</Text>
				<Text>Base Branch: </Text>
				{isEditing ? (
					<Text color="yellow">{editValue}█</Text>
				) : (
					<Text bold={selectedItem === 'baseBranch'} color={modeConfig.color}>
						{baseBranch}
					</Text>
				)}
			</Box>

			{/* Auto Stash setting */}
			<Box>
				<Text color={selectedItem === 'autoStash' ? modeConfig.color : undefined}>
					{selectedItem === 'autoStash' ? '▸ ' : '  '}
				</Text>
				<Text>Auto Stash: </Text>
				<Text bold={selectedItem === 'autoStash'} color={autoStash ? 'green' : 'red'}>
					{autoStash ? 'ON' : 'OFF'}
				</Text>
			</Box>

			<Box marginTop={1}>
				<Text dimColor={theme.help.dimmed}>
					{isEditing
						? 'Enter save  Esc cancel'
						: '↑↓ navigate  Enter/Space toggle  Tab switch tab  q quit'}
				</Text>
			</Box>
		</Box>
	)
}
