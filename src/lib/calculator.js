/**
 * HVO100 Erlös-Kalkulator – THG-Quote, BEHG, Kraftstoffkosten
 * Annahmen: HVO100 ersetzt Diesel 1:1, THG-Minderung ~90 %, BEHG-Befreiung pro Liter
 */

const LITER_PRO_100_KM_DEFAULT = 38;
const THG_MINDERUNG_PROZENT = 90; // HVO100 Minderung in %

/**
 * Berechnet Dieselverbrauch in Liter pro Jahr
 * @param {number} anzahlBusse
 * @param {number} laufleistungKm
 * @param {number} literPro100Km
 */
export function dieselVerbrauchProJahr(anzahlBusse, laufleistungKm, literPro100Km) {
  if (!anzahlBusse || !laufleistungKm || !literPro100Km) return 0;
  const literProBus = (laufleistungKm / 100) * literPro100Km;
  return anzahlBusse * literProBus;
}

/**
 * THG-Quote Erlöse in Euro (Quotenpreis in €/t CO2)
 * @param {number} literHvo - Verbrauch HVO in Liter/Jahr
 * @param {number} quotenPreisEurProTonne - € pro Tonne CO2-Minderung
 */
/** CO2-Minderung in t pro Liter (Diesel ~2,65 kg/L, HVO ~0,2 kg/L → 2,45 kg/L = 0,00245 t/L) */
const CO2_MINDERUNG_T_PRO_LITER = (2.65 - 0.2) / 1000;

export function thgQuoteErloese(literHvo, quotenPreisEurProTonne) {
  if (!literHvo || quotenPreisEurProTonne == null) return 0;
  const minderungT = literHvo * CO2_MINDERUNG_T_PRO_LITER;
  return minderungT * quotenPreisEurProTonne;
}

/**
 * CO2-Steuer-Ersparnis (BEHG) in Euro – Befreiung pro Liter HVO
 * @param {number} literHvo
 * @param {number} behgCentProLiter
 */
export function behgErsparnisEuro(literHvo, behgCentProLiter) {
  if (!literHvo || behgCentProLiter == null) return 0;
  return (literHvo * behgCentProLiter) / 100;
}

/**
 * Mehrkosten Kraftstoff (HVO vs. Diesel) in Euro
 * @param {number} liter
 * @param {number} dieselCentProLiter
 * @param {number} hvoCentProLiter
 */
export function kraftstoffMehrkostenEuro(liter, dieselCentProLiter, hvoCentProLiter) {
  if (!liter || dieselCentProLiter == null || hvoCentProLiter == null) return 0;
  const mehrkostenCent = (hvoCentProLiter - dieselCentProLiter) * liter;
  return mehrkostenCent / 100;
}

/**
 * Nettovorteil = THG-Erlöse + BEHG-Ersparnis − Kraftstoff-Mehrkosten
 */
export function nettoVorteilEuro(thgErloese, behgErsparnis, kraftstoffMehrkosten) {
  return thgErloese + behgErsparnis - kraftstoffMehrkosten;
}

/**
 * CO2-Emissionen Diesel (kg CO2/Liter, typ. ~2,65)
 */
export const CO2_KG_PRO_LITER_DIESEL = 2.65;

/**
 * CO2-Emissionen HVO100 (kg CO2/Liter, typ. ~0,2)
 */
export const CO2_KG_PRO_LITER_HVO = 0.2;

export function co2DieselKg(liter) {
  return liter * CO2_KG_PRO_LITER_DIESEL;
}

export function co2HvoKg(liter) {
  return liter * CO2_KG_PRO_LITER_HVO;
}

export function co2EinsparungKg(literDiesel) {
  return co2DieselKg(literDiesel) - co2HvoKg(literDiesel);
}
