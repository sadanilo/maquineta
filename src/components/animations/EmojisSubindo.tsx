import { useMemo } from 'react'

const EMOJIS = ['🎉', '⭐', '💳', '💰', '🎊', '✨', '🌟', '💫']

export function EmojisSubindo() {
  const items = useMemo(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      emoji: EMOJIS[i % EMOJIS.length],
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
    })),
  [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute text-2xl"
          style={{
            left: item.left,
            bottom: '-30px',
            animation: `emojiRise ${item.duration} linear ${item.delay} infinite`,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  )
}
