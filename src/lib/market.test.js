import { describe, it, expect } from 'vitest'
import {
  fetchMarketData,
  getBehgCentPerLiter,
  getThgQuotenPreis,
  isValidMarketData,
  formatMarketDate,
} from './market.js'

describe('market router', () => {

  it('fetchMarketData returns object with required numeric fields and lastUpdated string', async () => {
    const data = await fetchMarketData()
    expect(data).toBeDefined()
    expect(typeof data.thgQuotenPreisEurProTonne).toBe('number')
    expect(typeof data.behgCentProLiter).toBe('number')
    expect(typeof data.dieselPreisCentProLiter).toBe('number')
    expect(typeof data.hvo100PreisCentProLiter).toBe('number')
    expect(typeof data.lastUpdated).toBe('string')
  })

  it('getBehgCentPerLiter returns number from market or fallback', () => {
    expect(getBehgCentPerLiter({ behgCentProLiter: 8.16 })).toBe(8.16)
    expect(getBehgCentPerLiter(null)).toBe(8.16)
    expect(getBehgCentPerLiter({})).toBe(8.16)
  })

  it('getThgQuotenPreis returns number from market or fallback', () => {
    expect(getThgQuotenPreis({ thgQuotenPreisEurProTonne: 450 })).toBe(450)
    expect(getThgQuotenPreis(null)).toBe(450)
  })

  it('isValidMarketData returns true only for valid market object', () => {
    const valid = {
      thgQuotenPreisEurProTonne: 450,
      behgCentProLiter: 8.16,
      dieselPreisCentProLiter: 168,
      hvo100PreisCentProLiter: 182,
      lastUpdated: '2025-02-24',
    }
    expect(isValidMarketData(valid)).toBe(true)
    expect(isValidMarketData(null)).toBe(false)
    expect(isValidMarketData({})).toBe(false)
    expect(isValidMarketData({ ...valid, thgQuotenPreisEurProTonne: '450' })).toBe(false)
  })

  it('formatMarketDate formats ISO date to DD.MM.YYYY', () => {
    expect(formatMarketDate('2025-02-24')).toBe('24.02.2025')
    expect(formatMarketDate('')).toBe('–')
    expect(formatMarketDate(null)).toBe('–')
  })
})
