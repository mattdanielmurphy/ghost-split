import { makeSlice, splitSession } from './splitSession'

import fs from 'fs'
import { makeSliceMap } from './makeSliceMap'

async function splitAllSessions(
	pathToMasterFolder: string,
	sliceMap: number[][],
) {
	const arrayOfTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	for (const computer of arrayOfTen) {
		const pathToComputerDir = pathToMasterFolder + `/COMPUTER ${computer}`
		console.log(pathToComputerDir)
		const sessionFilesForComputer = fs
			.readdirSync(pathToComputerDir)
			.filter((fileName) => !fileName.startsWith('.'))

		const sessionFiles: { [key: number]: string } = {}

		sessionFilesForComputer.forEach((sessionFile: string) => {
			const sessionNumberMatches = /^[^[\n]*([1-9]0?)00/.exec(sessionFile)

			if (sessionNumberMatches) {
				const sessionNumber: number = Number(sessionNumberMatches[1])
				sessionFiles[sessionNumber] = sessionFile
			}
		})

		for (const session of arrayOfTen) {
			const sessionFileName = sessionFiles[session]
			const pathToSessionFile = pathToComputerDir + '/' + sessionFileName
			const outputDir = pathToMasterFolder + '/SLICES'
			await splitSession(
				sliceMap,
				pathToSessionFile,
				outputDir,
				computer,
				session,
			)
		}
	}
}

;(async () => {
	const sliceMap = await makeSliceMap()

	const pathToMasterFolder =
		'/Volumes/T7/GOFD BOUNCED AUDIO (Pitch Error at the end)'
	const pathToSingleSession =
		'/Users/matt/Downloads/TEST/COMPUTER 2 - SESSION 3.wav'

	// await splitAllSessions(pathToMasterFolder, sliceMap)

	// ! <TESTING>
	// const session = 2
	// const computer = 1
	// const filePath =
	// 	'/Volumes/T7/GOFD BOUNCED AUDIO (Pitch Error at the end)/COMPUTER 1/1GOFD 200 MASTER SESSION DONE.wav'
	// const outputDir =
	// 	'/Volumes/T7/GOFD BOUNCED AUDIO (Pitch Error at the end)/SLICES'
	// const start = 2250764.7431567432
	// const end = 2274615.674833762
	// const index = 77
	// await makeSlice(session, computer, filePath, outputDir, start, end, index)
	// ! </TESTING>
	const filePath = process.argv[1]
	const outputDir = process.argv[2]

	await splitSession(sliceMap, filePath, outputDir, 10, 1)

	console.log('🎉 Done! Audio for all sessions has been split.')
})()
