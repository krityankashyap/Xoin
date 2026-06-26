import { useGetCapitalGains } from '@/hooks/apis/capitalGains/useGetCapitalGains'
import { useHarvesting } from '@/hooks/context/useHarvesting'
import { CapitalGainsCard } from '@/components/molecules/CapitalGainsCard/CapitalGainsCard'
import { applyHarvestSelection, getRealisedGain, getSavings } from '@/utils/capitalGains'

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 flex-1 min-h-[280px] bg-gray-700/30 animate-pulse border border-gray-700/50">
      <div className="h-5 w-36 bg-gray-600 rounded mb-6" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-4 bg-gray-600/50 rounded mb-3" />
      ))}
    </div>
  )
}

export function CapitalGainsSection() {
  const { data, isLoading, isError } = useGetCapitalGains()
  const { selectedHoldings } = useHarvesting()

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-900/30 border border-red-700 rounded-2xl text-red-400 text-sm">
        Failed to load capital gains data. Please refresh.
      </div>
    )
  }

  const preCapitalGains = data.capitalGains
  const postCapitalGains = applyHarvestSelection(preCapitalGains, selectedHoldings)
  const savings = getSavings(getRealisedGain(preCapitalGains), getRealisedGain(postCapitalGains))

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <CapitalGainsCard variant="pre" capitalGains={preCapitalGains} savings={null} />
      <CapitalGainsCard variant="post" capitalGains={postCapitalGains} savings={savings} />
    </div>
  )
}
