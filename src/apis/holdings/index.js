import holdingsData from '@/mocks/holdings.json'

export function getHoldings() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(holdingsData), 400)
  })
}
