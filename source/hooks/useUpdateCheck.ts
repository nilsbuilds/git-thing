import {useState, useEffect} from 'react'
import {readFileSync} from 'fs'

type UpdateCheckResult = {
	updateAvailable: boolean
	latestVersion: string | null
	currentVersion: string
}

function compareVersions(current: string, latest: string): boolean {
	const currentParts = current.split('.').map(Number)
	const latestParts = latest.split('.').map(Number)

	for (let i = 0; i < 3; i++) {
		const c = currentParts[i] ?? 0
		const l = latestParts[i] ?? 0
		if (l > c) return true
		if (l < c) return false
	}

	return false
}

function getCurrentVersion(): string {
	const packageJsonPath = new URL('../../package.json', import.meta.url)
	const packageJson = JSON.parse(
		readFileSync(packageJsonPath, 'utf8'),
	) as {version: string}
	return packageJson.version
}

export const currentVersion = getCurrentVersion()

export function useUpdateCheck(): UpdateCheckResult {
	const [latestVersion, setLatestVersion] = useState<string | null>(null)
	const [updateAvailable, setUpdateAvailable] = useState(false)

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(
					'https://registry.npmjs.org/-/package/git-thing/dist-tags',
				)
				const data = (await response.json()) as {latest: string}
				const latest = data.latest
				setLatestVersion(latest)
				setUpdateAvailable(compareVersions(currentVersion, latest))
			} catch {
				// Silently fail — offline, fetch unavailable (Node 16), etc.
			}
		})()
	}, [currentVersion])

	return {updateAvailable, latestVersion, currentVersion}
}
