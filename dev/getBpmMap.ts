import fs from 'fs/promises'

function getClipBpmPromiseArray(pathToClipsDir: string) {
	const clipBpmPromises: Promise<{ bpm: number; i: number }>[] = []

	async function getBpmFromClip(i: number) {
		const filePath = `${pathToClipsDir}/${i}.json`
		const rawText = await fs.readFile(filePath, 'utf-8')
		const { bpm } = JSON.parse(rawText)
		return { bpm, i }
	}

	for (let i = 1; i < 1001; i++) {
		clipBpmPromises.push(getBpmFromClip(i))
	}

	return clipBpmPromises
}

export async function getBpmMap() {
	const pathToClipsDir = './clips'
	const clipBpmPromises = getClipBpmPromiseArray(pathToClipsDir)

	process.stdout.write('Getting BPM Map...')
	const clipBpmsUnsorted = await Promise.all(clipBpmPromises)
	process.stdout.write(' ✔ Done!\n')

	// these should be sorted already, but found different values once testing
	return clipBpmsUnsorted.sort((a, b) => a.i - b.i).map(({ bpm, i }) => bpm)
}
