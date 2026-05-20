export function createSoundEngine() {
  let ctx: AudioContext | null = null
  let muted = false

  function getCtx() {
    if (!ctx) ctx = new AudioContext()
    return ctx
  }

  function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
    if (muted) return
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + duration)
  }

  function bipAproximacao() {
    playTone(1000, 0.1, 'square', 0.1)
  }

  function somProcessando() {
    const notes = [440, 554, 659, 880]
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, 'sine', 0.1), i * 150)
    })
  }

  function somAprovado() {
    playTone(523, 0.2, 'sine', 0.15)
    setTimeout(() => playTone(659, 0.2, 'sine', 0.15), 200)
    setTimeout(() => playTone(784, 0.4, 'sine', 0.15), 400)
  }

  function somRecusado() {
    const c = getCtx()
    if (!muted) {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = 300
      osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.4)
      gain.gain.value = 0.1
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start()
      osc.stop(c.currentTime + 0.4)
    }
  }

  function aplausos() {
    if (muted) return
    const c = getCtx()
    for (let i = 0; i < 30; i++) {
      const noise = c.createBufferSource()
      const buf = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate)
      const data = buf.getChannelData(0)
      for (let j = 0; j < data.length; j++) {
        data[j] = Math.random() * 2 - 1
      }
      noise.buffer = buf
      const gain = c.createGain()
      gain.gain.value = 0.03
      setTimeout(() => {
        noise.connect(gain)
        gain.connect(c.destination)
        noise.start()
      }, Math.random() * 1500)
    }
  }

  function setMuted(m: boolean) {
    muted = m
  }

  return { bipAproximacao, somProcessando, somAprovado, somRecusado, aplausos, setMuted }
}
