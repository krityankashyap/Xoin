import { useHarvesting } from '@/hooks/context/useHarvesting'
import { useGetHoldings } from '@/hooks/apis/holdings/useGetHoldings'

export function HoldingsTableHeader() {
  const { isAllSelected, toggleAll } = useHarvesting()
  const { data = [] } = useGetHoldings()
  const allIds = data.map((_, i) => i)

  return (
    <thead>
      <tr className="border-b border-gray-700">
        <th className="py-3 px-4 w-10">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={() => toggleAll(allIds)}
            className="w-4 h-4 cursor-pointer accent-blue-500 rounded"
          />
        </th>
        <th className="py-3 px-4 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
          Asset
        </th>
        <th className="py-3 px-4 text-right text-gray-400 text-xs font-semibold uppercase tracking-wide">
          <div>Holdings</div>
          <div className="text-gray-500 normal-case font-normal">Current Market Rate</div>
        </th>
        <th className="py-3 px-4 text-right text-gray-400 text-xs font-semibold uppercase tracking-wide">
          Total Current Value
        </th>
        <th className="py-3 px-4 text-right text-gray-400 text-xs font-semibold uppercase tracking-wide">
          Short-term
        </th>
        <th className="py-3 px-4 text-right text-gray-400 text-xs font-semibold uppercase tracking-wide">
          Long-Term
        </th>
        <th className="py-3 px-4 text-right text-gray-400 text-xs font-semibold uppercase tracking-wide">
          Amount to Sell
        </th>
      </tr>
    </thead>
  )
}
