import { useRef, useCallback } from 'react'
import { createCameraDarknessDetector } from '../lib/detectors/cameraDarkness'
import type { CardDetector } from '../types'

let detectorInstance: CardDetector | null = null
let detectorCallbacks: Set<() => void> = new Set()

function getOrCreateDetector(): CardDetector {
  if (!detectorInstance) {
    detectorInstance = createCameraDarknessDetector()
  }
  return detectorInstance
}

export function useCamera() {
  const isRunning = useRef(false)

  const start = useCallback(async (onDetect: () => void) => {
    if (isRunning.current) return
    const detector = getOrCreateDetector()

    const available = await detector.isAvailable()
    if (!available) return

    detectorCallbacks.add(onDetect)
    try {
      await detector.start(() => {
        detectorCallbacks.forEach((cb) => cb())
      })
      isRunning.current = true
    } catch {
      detectorCallbacks.delete(onDetect)
    }
  }, [])

  const stop = useCallback(() => {
    const detector = getOrCreateDetector()
    detector.stop()
    detectorCallbacks.clear()
    isRunning.current = false
  }, [])

  return { start, stop }
}
