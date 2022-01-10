import { makeSliceMap } from './makeSliceMap'
import { splitSession } from './splitSession'

async function splitAllSessions(
	pathToMasterFolder: string,
	sliceMap: number[][],
) {
	for (let computer = 1; computer < 11; computer++) {
		for (let session = 1; session < 11; session++) {
			// /Users/matt/Downloads/GOFD ALL SESSIONS/COMPUTER 1/GOFD 100 MASTER SESSION DONE.als
			// const dirPath = `GOFD ${}`
			const filePath =
				pathToMasterFolder + `COMPUTER ${computer} - SESSION ${session}.wav`

			const slicesForSession = sliceMap[session]

			// splitSession(sliceMap, )
		}
	}
}

async function splitSingleSession(filePath: string, sliceMap: number[][]) {
	await splitSession(sliceMap, filePath, 3)
}

;(async () => {
	const sliceMap = await makeSliceMap()

	const pathToMasterFolder = process.argv[2]
	const pathToSingleSession =
		'/Users/matt/Downloads/TEST/COMPUTER 2 - SESSION 3.wav'

	// await splitAllSessions(pathToMasterFolder, sliceMap)
	await splitSingleSession(pathToSingleSession, sliceMap)

	console.log('🎉 Done! Audio for all sessions has been split.')
})()
