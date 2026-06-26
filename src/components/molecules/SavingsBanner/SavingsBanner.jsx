import { formatCurrency } from '@/utils/format'

export function SavingsBanner({ amount }) {
  return (
    <div className="bg-green-400/20 border border-green-400/40 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <span className="text-green-300 text-sm font-semibold">
        You're going to save {formatCurrency(amount)}
      </span>
    </div>
  )
}
