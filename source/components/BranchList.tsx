import React, {useState, useEffect} from 'react'
import {Box, Text, useInput} from 'ink'
import {useGitBranches} from '../hooks/useGitBranches.js'
import {theme} from '../constants/theme.js'
import {NavigationInfo} from './NavigationInfo.js'

type Mode = 'selection' | 'rebase'

type BranchListProps = {
	baseBranch: string
	autoStash: boolean
	isActive: boolean
	onStatusChange: (message: string | null, type: 'success' | 'error') => void
}

export function BranchList({
	baseBranch,
	autoStash,
	isActive,
	onStatusChange,
}: BranchListProps) {
	const {branches, loading, error, checkout, rebaseMaster} = useGitBranches()
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [mode, setMode] = useState<Mode>('selection')
	const [rebasedBranch, setRebasedBranch] = useState<string | null>(null)

	// Clear rebased indicator after 3 seconds
	useEffect(() => {
		if (!rebasedBranch) {
			return
		}
		const timer = setTimeout(() => {
			setRebasedBranch(null)
		}, 3000)
		return () => clearTimeout(timer)
	}, [rebasedBranch])

	const cycleMode = () => {
		setMode((m) => (m === 'selection' ? 'rebase' : 'selection'))
	}

	useInput(
		(_input, key) => {
			// SHIFT+TAB to switch modes within branch list
			if (key.shift && key.tab) {
				cycleMode()
				return
			}

			if (key.upArrow) {
				setSelectedIndex((i) => (i > 0 ? i - 1 : branches.length - 1))
			} else if (key.downArrow) {
				setSelectedIndex((i) => (i < branches.length - 1 ? i + 1 : 0))
			} else if (key.return) {
				const branch = branches[selectedIndex]
				if (branch && !branch.isCurrent) {
					if (mode === 'selection') {
						checkout(branch.name).catch((err) => {
							onStatusChange(err.message, 'error')
						})
					} else if (mode === 'rebase') {
						const branchName = branch.name
						rebaseMaster({baseBranch, autoStash})
							.then(() => {
								setRebasedBranch(branchName)
							})
							.catch((err) => {
								onStatusChange(err.message, 'error')
							})
					}
				}
			}
		},
		{isActive}
	)

	if (loading) {
		return <Text dimColor>Loading branches...</Text>
	}

	if (error) {
		return <Text color={theme.error.color}>Error: {error}</Text>
	}

	if (branches.length === 0) {
		return <Text dimColor>No branches found</Text>
	}

	const modeConfig = theme.modes[mode]

	return (
		<Box flexDirection="column" flexGrow={1}>
			<Box flexDirection="column" paddingLeft={2}>
				{branches.map((branch, index) => {
					const isSelected = index === selectedIndex
					const wasRebased = branch.name === rebasedBranch
					return (
						<Box key={branch.name}>
							<Text
								color={branch.isCurrent ? theme.branch.currentColor : isSelected ? modeConfig.color : undefined}
								bold={isSelected && theme.branch.selectedBold}
							>
								{''}
								{branch.name}
							</Text>
							{wasRebased && (
								<Text bold color={theme.modes.rebase.color}>
									{' '}
									REBASED
								</Text>
							)}
						</Box>
					)
				})}
				<Box marginTop={1} flexDirection="column">
					<Box>
						<Text>MODE: </Text>
						<Text bold color={modeConfig.color}>
							{modeConfig.label}
						</Text>
						{mode === 'rebase' && <Text dimColor> (base: {baseBranch})</Text>}
					</Box>
				</Box>
			</Box>
			<Box flexGrow={1} />
			<NavigationInfo
				isActive={isActive}
				shortcuts={[
					'↑↓ Navigate',
					`Enter ${mode === 'selection' ? 'Checkout' : 'Rebase'}`,
					'Shift+Tab Switch mode',
					'Tab Switch tab',
					'Esc Quit',
				]}
			/>
		</Box>
	)
}
