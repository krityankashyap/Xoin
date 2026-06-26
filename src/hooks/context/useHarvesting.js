import { useContext } from 'react'
import { HarvestingContext } from '@/context/HarvestingContext'

export function useHarvesting() {
  const ctx = useContext(HarvestingContext)
  if (!ctx) throw new Error('useHarvesting must be used within HarvestingProvider')
  return ctx
}
