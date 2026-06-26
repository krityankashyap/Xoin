export function getNetGain({ profits, losses }) {
  return profits - losses
}

export function getRealisedGain(capitalGains) {
  return getNetGain(capitalGains.stcg) + getNetGain(capitalGains.ltcg)
}

export function applyHarvestSelection(baseCapitalGains, selectedHoldings) {
  let stcgProfits = baseCapitalGains.stcg.profits
  let stcgLosses = baseCapitalGains.stcg.losses
  let ltcgProfits = baseCapitalGains.ltcg.profits
  let ltcgLosses = baseCapitalGains.ltcg.losses

  for (const holding of selectedHoldings) {
    if (holding.stcg.gain > 0) {
      stcgProfits += holding.stcg.gain
    } else if (holding.stcg.gain < 0) {
      stcgLosses += Math.abs(holding.stcg.gain)
    }

    if (holding.ltcg.gain > 0) {
      ltcgProfits += holding.ltcg.gain
    } else if (holding.ltcg.gain < 0) {
      ltcgLosses += Math.abs(holding.ltcg.gain)
    }
  }

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses },
  }
}

export function getSavings(preRealised, postRealised) {
  return preRealised > postRealised ? preRealised - postRealised : null
}
