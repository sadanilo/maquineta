export function Confete() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#ff0', '#f0f', '#0ff', '#0f0', '#f00', '#ff8800', '#88ff00'][i % 7],
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animation: `confeteFall ${1 + Math.random() * 2}s linear ${Math.random()}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
