import { formatCurrency } from '@/utils/format'
import { GainValue } from '@/components/atoms/GainValue/GainValue'

export function StatRow({ label, value, isNet = false }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-300 text-sm">{label}</span>
      {isNet ? (
        <GainValue value={value} />
      ) : (
        <span className="text-white text-sm font-medium">{formatCurrency(value)}</span>
      )}
    </div>
  )
}
