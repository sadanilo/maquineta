import type { CardDetector } from '../../types'

export function createCameraDarknessDetector(): CardDetector {
  let stream: MediaStream | null = null
  let animationId: number | null = null
  let detectCallback: (() => void) | null = null
  let video: HTMLVideoElement | null = null
  let canvas: HTMLCanvasElement | null = null
  let coveredSince: number | null = null
  let coveredLongEnough = false

  const DARK_THRESHOLD = 20
  const COVER_DURATION_MS = 1000

  let currentBrightness = 0

  function checkBrightness() {
    if (!video || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, 1, 1)
    const data = ctx.getImageData(0, 0, 1, 1).data
    currentBrightness = (data[0] + data[1] + data[2]) / 3

    if (currentBrightness < DARK_THRESHOLD) {
      if (!coveredSince) coveredSince = Date.now()
      coveredLongEnough = Date.now() - coveredSince >= COVER_DURATION_MS
      if (coveredLongEnough && detectCallback) {
        detectCallback()
        coveredSince = null
        coveredLongEnough = false
      }
    } else {
      coveredSince = null
      coveredLongEnough = false
    }

    animationId = requestAnimationFrame(checkBrightness)
  }

  return {
    async start(onDetect: () => void) {
      detectCallback = onDetect
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1, height: 1 },
        })
        video = document.createElement('video')
        video.srcObject = stream
        video.play()
        canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        animationId = requestAnimationFrame(checkBrightness)
      } catch {
        throw new Error('Camera not available')
      }
    },

    stop() {
      if (animationId !== null) cancelAnimationFrame(animationId)
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
      video = null
      canvas = null
      stream = null
      animationId = null
      detectCallback = null
      coveredSince = null
      coveredLongEnough = false
    },

    async isAvailable() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        return devices.some((d) => d.kind === 'videoinput')
      } catch {
        return false
      }
    },

    getBrightness() {
      return currentBrightness
    },
  }
}
