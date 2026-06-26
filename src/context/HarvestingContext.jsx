import { createContext, useState, useMemo } from 'react'
import { useGetHoldings } from '@/hooks/apis/holdings/useGetHoldings'

export const HarvestingContext = createContext(null)

export function HarvestingProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState(new Set())
  const { data: holdings = [] } = useGetHoldings()

  const toggleHolding = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = (allIds) => {
    setSelectedIds((prev) => {
      const allSelected = allIds.every((id) => prev.has(id))
      return allSelected ? new Set() : new Set(allIds)
    })
  }

  const isAllSelected = useMemo(() => {
    if (holdings.length === 0) return false
    return holdings.every((_, i) => selectedIds.has(i))
  }, [selectedIds, holdings])

  const selectedHoldings = useMemo(() => {
    return holdings.filter((_, i) => selectedIds.has(i))
  }, [selectedIds, holdings])

  return (
    <HarvestingContext.Provider
      value={{ selectedIds, toggleHolding, toggleAll, isAllSelected, selectedHoldings }}
    >
      {children}
    </HarvestingContext.Provider>
  )
}
