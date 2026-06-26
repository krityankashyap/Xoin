import { useQuery } from '@tanstack/react-query'
import { getHoldings } from '@/apis/holdings'

export function useGetHoldings() {
  return useQuery({
    queryKey: ['holdings'],
    queryFn: getHoldings,
  })
}
