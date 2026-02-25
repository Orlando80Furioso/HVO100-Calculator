/**
 * Market Router – tagesaktuelle Marktdaten für THG-Quote, BEHG und Kraftstoffpreise
 * Diesel/HVO: Tankerkönig-API (Mönchengladbach). THG: Fallback (keine öffentliche API).
 */

const MONCHENGLADBACH_LAT = 51.195
const MONCHENGLADBACH_LNG = 6.442
const TANKERKOENIG_RADIUS_KM = 5
const TANKERKOENIG_LIST_URL = 'https://creativecommons.tankerkoenig.de/json/list.php'

/** Typischer Aufschlag HVO100 vs. Diesel in Cent (wenn keine HVO-Daten verfügbar). */
const HVO_AUFSCHLAG_CENT = 12

const FALLBACK_DATA = {
  thgQuotenPreisEurProTonne: 120,
  behgCentProLiter: 8.16,
  dieselPreisCentProLiter: 168.5,
  hvo100PreisCentProLiter: 182.0,
  lastUpdated: new Date().toISOString().split('T')[0],
  source: 'fallback',
}

/**
 * Holt tagesaktuelle Dieselpreise für Mönchengladbach von Tankerkönig
 * @param {string} apiKey - Tankerkönig API-Key (kostenlos: https://creativecommons.tankerkoenig.de/)
 * @returns {Promise<{ dieselCentProLiter: number, stationCount: number } | null>}
 */
export async function fetchTankerkoenigDiesel(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return null
  const url = `${TANKERKOENIG_LIST_URL}?lat=${MONCHENGLADBACH_LAT}&lng=${MONCHENGLADBACH_LNG}&rad=${TANKERKOENIG_RADIUS_KM}&sort=dist&type=diesel&apikey=${apiKey}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data.stations) || data.stations.length === 0) return null
    const prices = data.stations
      .map((s) => (s.diesel != null ? Number(s.diesel) : NaN))
      .filter((p) => !Number.isNaN(p) && p > 0)
    if (prices.length === 0) return null
    const avgEuro = prices.reduce((a, b) => a + b, 0) / prices.length
    const dieselCentProLiter = Math.round(avgEuro * 100)
    return { dieselCentProLiter, stationCount: prices.length }
  } catch {
    return null
  }
}

/**
 * Holt tagesaktuelle Marktdaten (Tankerkönig für Diesel/HVO in Mönchengladbach, THG-Fallback)
 * @param {{ tankerkoenigApiKey?: string }} [options] - Optional: Tankerkönig API-Key für echte Dieselpreise
 * @returns {Promise<{ thgQuotenPreisEurProTonne: number, behgCentProLiter: number, dieselPreisCentProLiter: number, hvo100PreisCentProLiter: number, lastUpdated: string, source?: string }>}
 */
export async function fetchMarketData(options = {}) {
  const apiKey = options.tankerkoenigApiKey ?? ((typeof import.meta !== 'undefined' && import.meta.env?.VITE_TANKERKOENIG_API_KEY) || '')
  const today = new Date().toISOString().split('T')[0]

  let dieselCentProLiter = FALLBACK_DATA.dieselPreisCentProLiter
  let hvo100CentProLiter = FALLBACK_DATA.hvo100PreisCentProLiter
  let source = 'fallback'

  const tk = await fetchTankerkoenigDiesel(apiKey)
  if (tk) {
    dieselCentProLiter = tk.dieselCentProLiter
    hvo100CentProLiter = dieselCentProLiter + HVO_AUFSCHLAG_CENT
    source = 'tankerkoenig_mg'
  }

  const thg = thgFallbackEurProTonne(today)

  return {
    thgQuotenPreisEurProTonne: thg,
    behgCentProLiter: FALLBACK_DATA.behgCentProLiter,
    dieselPreisCentProLiter: dieselCentProLiter,
    hvo100PreisCentProLiter: hvo100CentProLiter,
    lastUpdated: today,
    source,
  }
}

/** THG-Quotenpreis €/t CO2 – kein öffentliches API, realistische Fallback-Range (z. B. 115–125 €/t). */
function thgFallbackEurProTonne(isoDate) {
  const seed = hashString(isoDate)
  return 115 + (seed % 11)
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

/**
 * Gibt die aktuell gültige BEHG-CO2-Steuer in Cent pro Liter (Ersparnis) zurück
 * @param {Object} market - Marktdaten von fetchMarketData
 * @returns {number} Cent pro Liter Ersparnis
 */
export function getBehgCentPerLiter(market) {
  if (!market || typeof market.behgCentProLiter !== 'number') {
    return FALLBACK_DATA.behgCentProLiter
  }
  return market.behgCentProLiter
}

/**
 * Gibt den THG-Quotenpreis in €/t CO2 zurück
 * @param {Object} market - Marktdaten
 * @returns {number}
 */
export function getThgQuotenPreis(market) {
  if (!market || typeof market.thgQuotenPreisEurProTonne !== 'number') {
    return FALLBACK_DATA.thgQuotenPreisEurProTonne
  }
  return market.thgQuotenPreisEurProTonne
}

/**
 * Validiert Marktdaten-Objekt
 * @param {unknown} data
 * @returns {boolean}
 */
export function isValidMarketData(data) {
  if (!data || typeof data !== 'object') return false
  const m = data
  return (
    typeof m.thgQuotenPreisEurProTonne === 'number' &&
    typeof m.behgCentProLiter === 'number' &&
    typeof m.dieselPreisCentProLiter === 'number' &&
    typeof m.hvo100PreisCentProLiter === 'number' &&
    typeof m.lastUpdated === 'string'
  )
}

/**
 * Formatiert Datum für Anzeige (TT.MM.JJJJ)
 * @param {string} isoDate
 * @returns {string}
 */
export function formatMarketDate(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '–'
  const [y, m, d] = isoDate.split('-')
  if (!d || !m || !y) return isoDate
  return `${d}.${m}.${y}`
}
