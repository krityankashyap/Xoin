const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  return inrFormatter.format(value)
}

const TINY_THRESHOLD = 0.000001

export function formatTokenAmount(value) {
  if (value === 0) return '0'
  if (Math.abs(value) < TINY_THRESHOLD) return '< 0.000001'
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(value)
  }
  return parseFloat(value.toPrecision(8)).toString()
}
