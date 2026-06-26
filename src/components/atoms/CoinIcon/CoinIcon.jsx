import { useState } from 'react'

export function CoinIcon({ src, alt, size = 32 }) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-gray-500 text-white text-xs font-bold flex-shrink-0"
        style={{ width: size, height: size }}
      >
        {alt?.[0]?.toUpperCase() || '?'}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full flex-shrink-0 object-cover"
      onError={() => setError(true)}
    />
  )
}
