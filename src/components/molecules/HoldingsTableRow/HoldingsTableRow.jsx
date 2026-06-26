import { CoinIcon } from '@/components/atoms/CoinIcon/CoinIcon'
import { useHarvesting } from '@/hooks/context/useHarvesting'
import { formatCurrency, formatTokenAmount } from '@/utils/format'

function GainCell({ gain, balance, coin }) {
  const isPos = gain > 0
  const isNeg = gain < 0
  const color = isPos ? 'text-green-400' : isNeg ? 'text-red-400' : 'text-gray-400'
  const prefix = isPos ? '+' : ''

  return (
    <td className="py-4 px-4 text-right">
      <div className={`text-sm font-semibold ${color}`}>
        {prefix}{formatCurrency(gain)}
      </div>
      <div className="text-gray-500 text-xs mt-0.5">
        {formatTokenAmount(balance)} {coin}
      </div>
    </td>
  )
}

export function HoldingsTableRow({ holding, index }) {
  const { selectedIds, toggleHolding } = useHarvesting()
  const isSelected = selectedIds.has(index)
  const totalValue = holding.currentPrice * holding.totalHolding

  return (
    <tr
      className={`border-b border-gray-700/50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-900/20' : 'hover:bg-white/5'
      }`}
      onClick={() => toggleHolding(index)}
    >
      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleHolding(index)}
          className="w-4 h-4 cursor-pointer accent-blue-500"
        />
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <CoinIcon src={holding.logo} alt={holding.coin} size={36} />
          <div>
            <div className="font-semibold text-white text-sm">{holding.coinName}</div>
            <div className="text-gray-500 text-xs">{holding.coin}</div>
          </div>
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        <div className="text-white text-sm font-medium">
          {formatTokenAmount(holding.totalHolding)} {holding.coin}
        </div>
        <div className="text-gray-500 text-xs">
          {formatCurrency(holding.currentPrice)}/{holding.coin}
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        <span className="text-white text-sm font-medium">{formatCurrency(totalValue)}</span>
      </td>

      <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} coin={holding.coin} />
      <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} coin={holding.coin} />

      <td className="py-4 px-4 text-right">
        {isSelected ? (
          <span className="text-white text-sm font-semibold">
            {formatTokenAmount(holding.totalHolding)} {holding.coin}
          </span>
        ) : (
          <span className="text-gray-500 text-sm">-</span>
        )}
      </td>
    </tr>
  )
}
