import {useState, useEffect, useCallback} from 'react'
import {readFileSync, writeFileSync, existsSync} from 'fs'
import {homedir} from 'os'
import {join} from 'path'

const SETTINGS_PATH = join(homedir(), '.git-thing-settings.json')

type Settings = {
	baseBranch: string
	autoStash: boolean
}

const DEFAULT_SETTINGS: Settings = {
	baseBranch: 'main',
	autoStash: true,
}

export function useSettings() {
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

	useEffect(() => {
		if (existsSync(SETTINGS_PATH)) {
			try {
				const data = JSON.parse(readFileSync(SETTINGS_PATH, 'utf-8'))
				setSettings({...DEFAULT_SETTINGS, ...data})
			} catch {
				// If file is corrupted, use defaults
			}
		}
	}, [])

	const updateSetting = useCallback(
		<K extends keyof Settings>(key: K, value: Settings[K]) => {
			setSettings((prev) => {
				const next = {...prev, [key]: value}
				writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2))
				return next
			})
		},
		[]
	)

	return {settings, updateSetting}
}
