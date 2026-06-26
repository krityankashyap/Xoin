import { getNetGain, getRealisedGain } from '@/utils/capitalGains'
import { formatCurrency } from '@/utils/format'

function Cell({ value, isLoss = false, isNet = false }) {
  const display = isLoss ? `- ${formatCurrency(Math.abs(value))}` : formatCurrency(value)
  let color = 'text-white'
  if (isNet) {
    color = value >= 0 ? 'text-green-400' : 'text-red-400'
  }
  return <td className={`py-2.5 text-right text-sm font-medium ${color}`}>{display}</td>
}

export function CapitalGainsCard({ variant, capitalGains, savings }) {
  const isPre = variant === 'pre'

  const stcgNet = getNetGain(capitalGains.stcg)
  const ltcgNet = getNetGain(capitalGains.ltcg)
  const totalRealised = getRealisedGain(capitalGains)

  const bgClass = isPre
    ? 'bg-[#131b2e] border border-gray-700/50'
    : 'bg-[#2563EB]'

  const label = isPre ? 'Pre Harvesting' : 'After Harvesting'
  const realisedLabel = isPre ? 'Realised Capital Gains:' : 'Effective Capital Gains:'

  return (
    <div className={`rounded-2xl p-6 flex-1 min-w-0 ${bgClass}`}>
      <h3 className="text-white font-bold text-lg mb-5">{label}</h3>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left" />
            <th className="text-right text-gray-300 text-sm font-medium pb-3 pr-2">Short-term</th>
            <th className="text-right text-gray-300 text-sm font-medium pb-3">Long-term</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          <tr>
            <td className="py-2.5 text-gray-300 text-sm">Profits</td>
            <Cell value={capitalGains.stcg.profits} />
            <Cell value={capitalGains.ltcg.profits} />
          </tr>
          <tr>
            <td className="py-2.5 text-gray-300 text-sm">Losses</td>
            <Cell value={capitalGains.stcg.losses} isLoss />
            <Cell value={capitalGains.ltcg.losses} isLoss />
          </tr>
          <tr>
            <td className="py-2.5 text-white font-semibold text-sm">Net Capital Gains</td>
            <Cell value={stcgNet} isNet />
            <Cell value={ltcgNet} isNet />
          </tr>
        </tbody>
      </table>

      <div className="border-t border-white/20 mt-4 pt-4">
        <div className="flex items-baseline gap-3">
          <span className="text-white font-semibold text-sm">{realisedLabel}</span>
          <span
            className={`text-2xl font-bold ${
              totalRealised >= 0 ? 'text-white' : 'text-red-300'
            }`}
          >
            {totalRealised < 0 ? '- ' : ''}
            {formatCurrency(Math.abs(totalRealised))}
          </span>
        </div>

        {!isPre && savings !== null && (
          <div className="mt-3 flex items-center gap-2">
            <span>🎉</span>
            <span className="text-yellow-300 text-sm font-medium">
              You are going to save upto{' '}
              <span className="font-bold">{formatCurrency(savings)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
