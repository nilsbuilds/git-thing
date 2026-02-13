import React, {useState, useEffect} from 'react'
import {Box, Text, useApp, useInput} from 'ink'
import {BranchList} from './components/BranchList'
import {Settings} from './components/Settings'
import {useSettings} from './hooks/useSettings'
import {theme} from './constants/theme'

type Tab = 'branches' | 'settings'

type StatusMessage = {
	text: string
	type: 'success' | 'error'
}

export default function App() {
	const {exit} = useApp()
	const {settings, updateSetting} = useSettings()
	const [activeTab, setActiveTab] = useState<Tab>('branches')
	const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

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
		if (input === 'q' || (key.ctrl && input === 'c')) {
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
			<Box flexDirection="column" flexGrow={1}>
				{activeTab === 'branches' ? (
					<BranchList
						baseBranch={settings.baseBranch}
						autoStash={settings.autoStash}
						isActive={activeTab === 'branches'}
						onStatusChange={handleStatusChange}
					/>
				) : (
					<Settings
						baseBranch={settings.baseBranch}
						autoStash={settings.autoStash}
						onBaseBranchChange={(value) => updateSetting('baseBranch', value)}
						onAutoStashChange={(value) => updateSetting('autoStash', value)}
						isActive={activeTab === 'settings'}
					/>
				)}
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
				) : (
					<Text dimColor>Press q to exit</Text>
				)}
			</Box>
		</Box>
	)
}
