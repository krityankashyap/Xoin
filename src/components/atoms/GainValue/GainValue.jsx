import { formatCurrency } from '@/utils/format'

export function GainValue({ value, className = '' }) {
  const isPositive = value > 0
  const isNegative = value < 0

  return (
    <span
      className={`font-medium ${
        isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-300'
      } ${className}`}
    >
      {isPositive ? '+' : ''}
      {formatCurrency(value)}
    </span>
  )
}
