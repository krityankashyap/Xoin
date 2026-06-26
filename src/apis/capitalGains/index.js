import capitalGainsData from '@/mocks/capitalGains.json'

export function getCapitalGains() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(capitalGainsData), 400)
  })
}
