import ffmpeg from 'fluent-ffmpeg'

let slicesToBeMade = 100
let slicesMade = 1

async function makeSlice(
	filePath: string,
	start: number,
	end: number,
	index: number,
) {
	const filePathWithoutExtension = filePath.replace(/\..*$/, '')
	const fileExtension = filePath.replace(/.*\.(.*$)/, '$1')

	const outputTrack = `${filePathWithoutExtension}-${
		index + 1
	}.${fileExtension}`
	start = start / 1000
	const length = end / 1000 - start
	console.log('start: ' + start, 'end: ' + end, ' length: ' + length)

	await new Promise((resolve, reject) => {
		let ffmpegCommand = ffmpeg()
			.setFfmpegPath('ffmpeg')
			.input(filePath)
			.setStartTime(start)
			.setDuration(length)
			.noVideo()

		ffmpegCommand
			.outputOptions('-c:a', 'copy')
			.on('start', (cmdline) => {
				// console.log(cmdline) // ? Enable for logging
			})
			.on('end', resolve)
			.on('error', reject)
			.saveToFile(outputTrack)
	})

	process.stdout.write(`Slices made: ${slicesMade++}/${slicesToBeMade}\r`)
}

export async function splitSession(
	sliceMap: number[][],
	filePath: string,
	sessionNumber: number,
) {
	console.log('Splitting session', sessionNumber, '\n\t@', filePath + '...')
	const slicesForSession = sliceMap[sessionNumber - 1]

	const slicePromises = slicesForSession.map((slice, i, arr) => {
		const prevEndTime = arr[i - 1] || 0
		const startTime = prevEndTime
		const endTime = slice
		return makeSlice(filePath, startTime, endTime, i)
	})
	await Promise.all(slicePromises)
	console.log('')
}
