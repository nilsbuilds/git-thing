import React, {useState, useEffect} from 'react'
import {Box, Text, useInput} from 'ink'
import {theme} from '../constants/theme.js'
import {currentVersion} from '../hooks/useUpdateCheck.js'
import {NavigationInfo} from './NavigationInfo.js'

type SettingsProps = {
	baseBranch: string
	autoStash: boolean
	sectionHeight: number
	onBaseBranchChange: (value: string) => void
	onAutoStashChange: (value: boolean) => void
	onSectionHeightChange: (value: number) => void
	isActive: boolean
	onEditingChange: (editing: boolean) => void
}

type SettingItem = 'baseBranch' | 'autoStash' | 'sectionHeight'

export function Settings({
	baseBranch,
	autoStash,
	sectionHeight,
	onBaseBranchChange,
	onAutoStashChange,
	onSectionHeightChange,
	isActive,
	onEditingChange,
}: SettingsProps) {
	const [selectedItem, setSelectedItem] = useState<SettingItem>('baseBranch')
	const [editValue, setEditValue] = useState(baseBranch)
	const [isEditing, setIsEditing] = useState(false)

	const settingItems: SettingItem[] = ['baseBranch', 'autoStash', 'sectionHeight']

	useEffect(() => {
		onEditingChange(isEditing)
	}, [isEditing])

	useInput(
		(input, key) => {
			if (isEditing) {
				if (key.return) {
					if (selectedItem === 'baseBranch') {
						if (editValue.trim()) {
							onBaseBranchChange(editValue.trim())
						}
					} else if (selectedItem === 'sectionHeight') {
						const parsed = Number.parseInt(editValue.trim(), 10)
						if (!Number.isNaN(parsed) && parsed >= 10) {
							onSectionHeightChange(parsed)
						}
					}
					setIsEditing(false)
				} else if (key.escape) {
					setEditValue(
						selectedItem === 'sectionHeight'
							? String(sectionHeight)
							: baseBranch
					)
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
				} else if (selectedItem === 'sectionHeight') {
					setIsEditing(true)
					setEditValue(String(sectionHeight))
				}
			}
		},
		{isActive}
	)

	const modeConfig = theme.modes.selection

	return (
		<Box flexDirection="column" flexGrow={1}>
			<Box flexDirection="column" paddingLeft={2}>
				{/* Base Branch setting */}
				<Text>
					<Text
						color={selectedItem === 'baseBranch' ? modeConfig.color : undefined}
						bold={selectedItem === 'baseBranch'}
					>
						Base Branch:{' '}
					</Text>
					{isEditing && selectedItem === 'baseBranch' ? (
						<Text color="yellow">{editValue}█</Text>
					) : (
						<Text
							bold={selectedItem === 'baseBranch'}
							color={selectedItem === 'baseBranch' ? modeConfig.color : undefined}
						>
							{baseBranch}
						</Text>
					)}
				</Text>

				{/* Auto Stash setting */}
				<Box>
					<Text
						color={selectedItem === 'autoStash' ? modeConfig.color : undefined}
						bold={selectedItem === 'autoStash'}
					>
						Auto Stash:{' '}
					</Text>
					<Text bold={selectedItem === 'autoStash'} color={autoStash ? 'green' : 'red'}>
						{autoStash ? 'ON' : 'OFF'}
					</Text>
				</Box>

				{/* Section Height setting */}
				<Text>
					<Text
						color={selectedItem === 'sectionHeight' ? modeConfig.color : undefined}
						bold={selectedItem === 'sectionHeight'}
					>
						Section Height:{' '}
					</Text>
					{isEditing && selectedItem === 'sectionHeight' ? (
						<Text color="yellow">{editValue}█</Text>
					) : (
						<Text
							bold={selectedItem === 'sectionHeight'}
							color={selectedItem === 'sectionHeight' ? modeConfig.color : undefined}
						>
							{sectionHeight}
						</Text>
					)}
				</Text>

				{/* Version */}
				<Box marginTop={1}>
					<Text color="rgb(255,165,0)">Version: {currentVersion}</Text>
				</Box>
			</Box>
			<Box flexGrow={1} />
			<NavigationInfo
				isActive={isActive && !isEditing}
				shortcuts={
					isEditing
						? ['Enter Save', 'Esc Cancel']
						: [
								'↑↓ Navigate',
								'Enter/Space Toggle',
								'Tab Switch tab',
								'Esc Quit',
							]
				}
			/>
		</Box>
	)
}
