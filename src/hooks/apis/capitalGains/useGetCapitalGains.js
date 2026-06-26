import { useQuery } from '@tanstack/react-query'
import { getCapitalGains } from '@/apis/capitalGains'

export function useGetCapitalGains() {
  return useQuery({
    queryKey: ['capitalGains'],
    queryFn: getCapitalGains,
  })
}
