import ffmpeg from 'fluent-ffmpeg'

let slicesToBeMade = 10e3
let slicesMade = 1

export async function makeSlice(
	session: number,
	computer: number,
	filePath: string,
	outputDir: string,
	start: number,
	end: number,
	index: number,
) {
	// const inputOptions = {
	// 	session,
	// 	computer,
	// 	filePath,
	// 	outputDir,
	// 	start,
	// 	end,
	// 	index,
	// }
	// console.log(inputOptions)
	const filePathWithoutExtension = filePath.replace(/\..*$/, '')
	const fileExtension = 'mp3'
	// filePath.replace(/.*\.(.*$)/, '$1')

	const outputTrack = `${outputDir}/computer-${computer} session-${session} ghost-${
		index + 1
	}.${fileExtension}`

	start = start / 1000
	const length = end / 1000 - start

	await new Promise((resolve, reject) => {
		let ffmpegCommand = ffmpeg()
			.setFfmpegPath('ffmpeg')
			.input(filePath)
			.setStartTime(start)
			.setDuration(length)
			.noVideo()

		ffmpegCommand
			.outputOptions('-b:a', '320k') // existing
			// .outputOptions('-c:a', 'copy') // ? existing
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
	outputDir: string,
	computerNumber: number,
	sessionNumber: number,
) {
	console.log('Splitting session', sessionNumber, '\n\t@', filePath + '...')
	const slicesForSession = sliceMap[sessionNumber - 1]

	const slicePromises = slicesForSession.map((slice, i, arr) => {
		const prevEndTime = arr[i - 1] || 0
		const startTime = prevEndTime
		const endTime = slice
		return makeSlice(
			sessionNumber,
			computerNumber,
			filePath,
			outputDir,
			startTime,
			endTime,
			i,
		)
	})
	await Promise.all(slicePromises)
	console.log('')
}
