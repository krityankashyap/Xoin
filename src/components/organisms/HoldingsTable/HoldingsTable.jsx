import { useState } from 'react'
import { useGetHoldings } from '@/hooks/apis/holdings/useGetHoldings'
import { HoldingsTableHeader } from '@/components/molecules/HoldingsTableHeader/HoldingsTableHeader'
import { HoldingsTableRow } from '@/components/molecules/HoldingsTableRow/HoldingsTableRow'

const INITIAL_ROWS = 5

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-700/50">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-gray-700 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export function HoldingsTable() {
  const { data, isLoading, isError } = useGetHoldings()
  const [showAll, setShowAll] = useState(false)

  if (isError) {
    return (
      <div className="p-6 bg-red-900/30 border border-red-700 rounded-2xl text-red-400 text-sm">
        Failed to load holdings. Please refresh the page.
      </div>
    )
  }

  const rows = isLoading ? [] : (showAll ? data : data.slice(0, INITIAL_ROWS))
  const hasMore = !isLoading && data.length > INITIAL_ROWS

  return (
    <div className="bg-[#131b2e] rounded-2xl overflow-hidden border border-gray-700/50">
      <div className="px-6 py-5 border-b border-gray-700/50">
        <h2 className="text-white font-bold text-lg">Holdings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <HoldingsTableHeader />
          <tbody>
            {isLoading
              ? Array.from({ length: INITIAL_ROWS }).map((_, i) => <SkeletonRow key={i} />)
              : rows.map((holding, i) => (
                  <HoldingsTableRow key={i} holding={holding} index={i} />
                ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="px-6 py-4 border-t border-gray-700/50">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {showAll ? 'View less' : 'View all'}
          </button>
        </div>
      )}
    </div>
  )
}
