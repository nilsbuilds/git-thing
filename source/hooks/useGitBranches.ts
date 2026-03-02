import {useState, useEffect, useCallback} from 'react'
import {execFile} from 'child_process'

export type Branch = {
	name: string
	isCurrent: boolean
}

export type RebaseOptions = {
	baseBranch: string
	autoStash: boolean
}

export type UseGitBranchesResult = {
	branches: Branch[]
	loading: boolean
	error: string | null
	refresh: () => void
	checkout: (branchName: string) => Promise<void>
	rebaseMaster: (options: RebaseOptions) => Promise<string>
}

export function useGitBranches(): UseGitBranchesResult {
	const [branches, setBranches] = useState<Branch[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadBranches = useCallback(() => {
		execFile('git', ['branch'], (err, stdout, stderr) => {
			setLoading(false)

			if (err) {
				if (stderr.includes('not a git repository')) {
					setError('Not a git repository')
				} else {
					setError(stderr || err.message)
				}
				return
			}

			const parsedBranches = stdout
				.split('\n')
				.filter((line) => line.trim())
				.map((line) => {
					const isCurrent = line.startsWith('*')
					const name = line.replace(/^\*?\s+/, '')
					return {name, isCurrent}
				})

			setBranches(parsedBranches)
		})
	}, [])

	const checkout = useCallback(
		(branchName: string): Promise<void> => {
			return new Promise((resolve, reject) => {
				execFile('git', ['checkout', branchName], (err, _stdout, stderr) => {
					if (err) {
						reject(new Error(stderr || err.message))
						return
					}
					loadBranches()
					resolve()
				})
			})
		},
		[loadBranches]
	)

	const rebaseMaster = useCallback(
		({baseBranch, autoStash}: RebaseOptions): Promise<string> => {
			return new Promise((resolve, reject) => {
				const currentBranch = branches.find((b) => b.isCurrent)?.name

				if (currentBranch === 'master') {
					// On master branch: just pull --rebase
					execFile(
						'git',
						['pull', '--rebase', 'origin', 'master'],
						(err, stdout, stderr) => {
							if (err) {
								reject(new Error(stderr || err.message))
								return
							}
							loadBranches()
							resolve(stdout || 'Successfully pulled and rebased master')
						}
					)
				} else {
					// On other branch: fetch origin master:master, then rebase
					execFile(
						'git',
						['fetch', 'origin', 'master:master'],
						(fetchErr, _fetchStdout, fetchStderr) => {
							if (fetchErr) {
								reject(new Error(fetchStderr || fetchErr.message))
								return
							}

							const rebaseArgs = ['rebase']
							if (autoStash) {
								rebaseArgs.push('--autostash')
							}
							rebaseArgs.push(baseBranch)

							execFile('git', rebaseArgs, (err, stdout, stderr) => {
								if (err) {
									reject(new Error(stderr || err.message))
									return
								}
								loadBranches()
								resolve(stdout || `Successfully rebased onto ${baseBranch}`)
							})
						}
					)
				}
			})
		},
		[loadBranches, branches]
	)

	useEffect(() => {
		loadBranches()
	}, [loadBranches])

	return {branches, loading, error, refresh: loadBranches, checkout, rebaseMaster}
}
