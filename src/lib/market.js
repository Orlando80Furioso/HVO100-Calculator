/**
 * Market Router – tagesaktuelle Marktdaten für THG-Quote, BEHG und Kraftstoffpreise
 */

const FALLBACK_DATA = {
  thgQuotenPreisCent: 42,
  behgCentProLiter: 8.16,
  dieselPreisCentProLiter: 168.5,
  hvo100PreisCentProLiter: 182.0,
  lastUpdated: new Date().toISOString().split('T')[0],
};

/**
 * Holt tagesaktuelle Marktdaten (simuliert API-Aufruf; in Produktion echte Quelle anbinden)
 * @returns {Promise<{ thgQuotenPreisCent: number, behgCentProLiter: number, dieselPreisCentProLiter: number, hvo100PreisCentProLiter: number, lastUpdated: string }>}
 */
export async function fetchMarketData() {
  try {
    const date = new Date().toISOString().split('T')[0];
    const seed = hashString(date);
    const thg = 38 + (seed % 12);
    const behg = 7.5 + (seed % 15) / 10;
    const diesel = 162 + (seed % 18);
    const hvo = diesel + 12 + (seed % 8);
    return {
      thgQuotenPreisCent: thg,
      behgCentProLiter: Math.round(behg * 100) / 100,
      dieselPreisCentProLiter: diesel,
      hvo100PreisCentProLiter: hvo,
      lastUpdated: date,
    };
  } catch {
    return { ...FALLBACK_DATA };
  }
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Gibt die aktuell gültige BEHG-CO2-Steuer in Cent pro Liter (Ersparnis) zurück
 * @param {Object} market - Marktdaten von fetchMarketData
 * @returns {number} Cent pro Liter Ersparnis
 */
export function getBehgCentPerLiter(market) {
  if (!market || typeof market.behgCentProLiter !== 'number') {
    return FALLBACK_DATA.behgCentProLiter;
  }
  return market.behgCentProLiter;
}

/**
 * Gibt den THG-Quotenpreis in Cent zurück
 * @param {Object} market - Marktdaten
 * @returns {number}
 */
export function getThgQuotenPreis(market) {
  if (!market || typeof market.thgQuotenPreisCent !== 'number') {
    return FALLBACK_DATA.thgQuotenPreisCent;
  }
  return market.thgQuotenPreisCent;
}

/**
 * Validiert Marktdaten-Objekt
 * @param {unknown} data
 * @returns {boolean}
 */
export function isValidMarketData(data) {
  if (!data || typeof data !== 'object') return false;
  const m = data;
  return (
    typeof m.thgQuotenPreisCent === 'number' &&
    typeof m.behgCentProLiter === 'number' &&
    typeof m.dieselPreisCentProLiter === 'number' &&
    typeof m.hvo100PreisCentProLiter === 'number' &&
    typeof m.lastUpdated === 'string'
  );
}

/**
 * Formatiert Datum für Anzeige (TT.MM.JJJJ)
 * @param {string} isoDate
 * @returns {string}
 */
export function formatMarketDate(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '–';
  const [y, m, d] = isoDate.split('-');
  if (!d || !m || !y) return isoDate;
  return `${d}.${m}.${y}`;
}
