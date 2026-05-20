import type { CardDetector } from '../../types'

export function createCameraDarknessDetector(): CardDetector {
  let stream: MediaStream | null = null
  let animationId: number | null = null
  let detectCallback: (() => void) | null = null
  let video: HTMLVideoElement | null = null
  let canvas: HTMLCanvasElement | null = null
  let coveredSince: number | null = null
  let coveredLongEnough = false
  let detectionStartsAt = 0

  const DARK_THRESHOLD = 100
  const COVER_DURATION_MS = 1000
  const WARMUP_MS = 1500

  let currentBrightness = 0

  function checkBrightness() {
    if (!video || !canvas) return
    if (video.readyState < 2) {
      animationId = requestAnimationFrame(checkBrightness)
      return
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const w = video.videoWidth || 2
    const h = video.videoHeight || 2
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }

    ctx.drawImage(video, 0, 0, w, h)
    const data = ctx.getImageData(0, 0, w, h).data
    let sum = 0
    const count = w * h
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3
    }
    currentBrightness = sum / count

    if (Date.now() < detectionStartsAt) {
      animationId = requestAnimationFrame(checkBrightness)
      return
    }

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
          video: { facingMode: 'user' },
        })
        video = document.createElement('video')
        video.srcObject = stream
        video.muted = true
        video.playsInline = true
        await video.play()
        canvas = document.createElement('canvas')
        coveredSince = null
        coveredLongEnough = false
        detectionStartsAt = Date.now() + WARMUP_MS
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
      detectionStartsAt = 0
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
