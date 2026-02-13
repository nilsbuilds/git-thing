import {defineConfig} from 'tsup'

export default defineConfig({
	entry: ['source/cli.tsx'],
	format: ['esm'],
	minify: true,
	clean: true,
})
