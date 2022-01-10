import { getBpmMap } from './getBpmMap'

export async function makeSliceMap() {
	const bpmMap = await getBpmMap()
	const sliceMap: number[][] = []

	for (let session = 0; session < 10; session++) {
		let totalDuration = 0

		const bpmMapForSession = bpmMap.slice(session * 100, session * 100 + 100)

		const sliceMapForSession = bpmMapForSession.map((bpm) => {
			// 60,000 (ms) ÷ BPM = duration of a quarter note
			const durationOfQuarterNote = 60e3 / bpm
			const durationOfBar = durationOfQuarterNote * 4
			const durationOf16Bars = durationOfBar * 16
			totalDuration += durationOf16Bars

			return totalDuration
		})

		sliceMap.push(sliceMapForSession)
	}

	return sliceMap
}
