import React, {useState, useEffect} from 'react'
import {Box, Text, useApp, useInput} from 'ink'
import {BranchList} from './components/BranchList.js'
import {Settings} from './components/Settings.js'
import {useSettings} from './hooks/useSettings.js'
import {useUpdateCheck} from './hooks/useUpdateCheck.js'
import {theme} from './constants/theme.js'

type Tab = 'branches' | 'settings'

type StatusMessage = {
	text: string
	type: 'success' | 'error'
}

export default function App() {
	const {exit} = useApp()
	const {settings, updateSetting} = useSettings()
	const {updateAvailable, latestVersion, currentVersion} = useUpdateCheck()
	const [activeTab, setActiveTab] = useState<Tab>('branches')
	const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
	const [isEditing, setIsEditing] = useState(false)

	// Auto-clear status message after 3s
	useEffect(() => {
		if (!statusMessage) {
			return
		}
		const timer = setTimeout(() => {
			setStatusMessage(null)
		}, 3000)
		return () => clearTimeout(timer)
	}, [statusMessage])

	useInput((input, key) => {
		if ((key.escape && !isEditing) || (key.ctrl && input === 'c')) {
			exit()
		}

		// Tab key switches tabs (but not Shift+Tab which is used for mode switching)
		if (key.tab && !key.shift) {
			setActiveTab((t) => (t === 'branches' ? 'settings' : 'branches'))
		}
	})

	const handleStatusChange = (message: string | null, type: 'success' | 'error') => {
		if (message) {
			setStatusMessage({text: message, type})
		} else {
			setStatusMessage(null)
		}
	}

	return (
		<Box flexDirection="column">
			{/* Tab bar */}
			<Box marginBottom={1}>
				<Text
					bold={activeTab === 'branches'}
					color={activeTab === 'branches' ? theme.tabs.activeColor : theme.tabs.inactiveColor}
				>
					[Branches]
				</Text>
				<Text> </Text>
				<Text
					bold={activeTab === 'settings'}
					color={activeTab === 'settings' ? theme.tabs.activeColor : theme.tabs.inactiveColor}
				>
					[Settings]
				</Text>
			</Box>

			{/* Tab content */}
			<Box flexDirection="column" height={settings.sectionHeight}>
				<Box flexDirection="column" flexGrow={1} display={activeTab === 'branches' ? 'flex' : 'none'}>
					<BranchList
						baseBranch={settings.baseBranch}
						autoStash={settings.autoStash}
						isActive={activeTab === 'branches'}
						onStatusChange={handleStatusChange}
					/>
				</Box>
				<Box flexDirection="column" flexGrow={1} display={activeTab === 'settings' ? 'flex' : 'none'}>
					<Settings
						baseBranch={settings.baseBranch}
						autoStash={settings.autoStash}
						sectionHeight={settings.sectionHeight}
						onBaseBranchChange={(value) => updateSetting('baseBranch', value)}
						onAutoStashChange={(value) => updateSetting('autoStash', value)}
						onSectionHeightChange={(value) => updateSetting('sectionHeight', value)}
						isActive={activeTab === 'settings'}
						onEditingChange={setIsEditing}
					/>
				</Box>
			</Box>

			{/* Persistent status bar at bottom */}
			<Box marginTop={1} height={1}>
				{statusMessage ? (
					<Text
						color={
							statusMessage.type === 'success'
								? theme.status.successColor
								: theme.status.errorColor
						}
					>
						{statusMessage.text}
					</Text>
				) : updateAvailable ? (
					<Text color={theme.status.updateColor}>
						Update available: v{latestVersion} (current: v{currentVersion}) — run
						npm i -g git-thing
					</Text>
				) : (
					<Text dimColor>Press Esc to exit</Text>
				)}
			</Box>
		</Box>
	)
}
