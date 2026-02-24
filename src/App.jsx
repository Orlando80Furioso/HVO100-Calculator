import React, { useState, useEffect, useMemo } from 'react'
import { fetchMarketData, getBehgCentPerLiter, getThgQuotenPreis, formatMarketDate } from './lib/market.js'
import {
  dieselVerbrauchProJahr,
  thgQuoteErloese,
  behgErsparnisEuro,
  kraftstoffMehrkostenEuro,
  nettoVorteilEuro,
  co2DieselKg,
  co2HvoKg,
} from './lib/calculator.js'
import { CalculatorForm } from './components/CalculatorForm.jsx'
import { KPICards } from './components/KPICards.jsx'
import { EmissionsvergleichChart, EinsparungsaufschlüsselungChart, PreisszenarienChart } from './components/Charts.jsx'
import { FinanzenTab } from './components/FinanzenTab.jsx'
import styles from './App.module.css'

const DEFAULT_INPUTS = {
  anzahlBusse: 50,
  laufleistungKm: 45000,
  literPro100Km: 38,
  quotenPreisCent: 42,
}

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [market, setMarket] = useState(null)
  const [marketLoading, setMarketLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeTab, setActiveTab] = useState('kalkulator')

  const loadMarket = async () => {
    setMarketLoading(true)
    try {
      const data = await fetchMarketData()
      setMarket(data)
      setLastUpdated(data.lastUpdated)
      setInputs((prev) => ({ ...prev, quotenPreisCent: data.thgQuotenPreisCent }))
    } finally {
      setMarketLoading(false)
    }
  }

  useEffect(() => {
    loadMarket()
  }, [])

  const behgCent = market ? getBehgCentPerLiter(market) : 8.16
  const quotenPreis = market ? getThgQuotenPreis(market) : inputs.quotenPreisCent
  const dieselPreis = market?.dieselPreisCentProLiter ?? 168.5
  const hvoPreis = market?.hvo100PreisCentProLiter ?? 182

  const { kpis, literJahr, dieselKg, hvoKg } = useMemo(() => {
    const liter = dieselVerbrauchProJahr(inputs.anzahlBusse, inputs.laufleistungKm, inputs.literPro100Km)
    const thg = thgQuoteErloese(liter, inputs.quotenPreisCent)
    const behg = behgErsparnisEuro(liter, behgCent)
    const mehrkosten = kraftstoffMehrkostenEuro(liter, dieselPreis, hvoPreis)
    const netto = nettoVorteilEuro(thg, behg, mehrkosten)
    return {
      literJahr: liter,
      dieselKg: co2DieselKg(liter),
      hvoKg: co2HvoKg(liter),
      kpis: {
        thgErloese: thg,
        behgErsparnis: behg,
        behgCentProLiter: behgCent,
        kraftstoffMehrkosten: mehrkosten,
        nettoVorteil: netto,
      },
    }
  }, [inputs, behgCent, dieselPreis, hvoPreis])

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>HVO100 Erlös-Kalkulator</h1>
          <p className={styles.tagline}>THG-Quoten-Erlöse · BEHG-Steuervorteil · Echtzeit-Kalkulation</p>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.updateBtn}
              onClick={loadMarket}
              disabled={marketLoading}
              aria-label="Tagesaktuelle Preise abrufen"
            >
              {marketLoading ? 'Wird geladen…' : 'Aktualisieren'}
            </button>
            {lastUpdated && (
              <span className={styles.lastUpdated}>
                Stand: {formatMarketDate(lastUpdated)} · BEHG: {behgCent.toFixed(2)} Ct./L Ersparnis
              </span>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={activeTab === 'kalkulator' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('kalkulator')}
          >
            Kalkulator
          </button>
          <button
            type="button"
            className={activeTab === 'finanzen' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('finanzen')}
          >
            Finanzen
          </button>
        </div>

        {activeTab === 'kalkulator' && (
          <>
            <CalculatorForm inputs={inputs} onChange={handleInputChange} />
            <section className={styles.kpiSection}>
              <KPICards kpis={kpis} />
            </section>
            <section className={styles.chartsSection}>
              <EmissionsvergleichChart dieselKg={dieselKg} hvoKg={hvoKg} />
              <EinsparungsaufschlüsselungChart
                thgErloese={kpis.thgErloese}
                behgErsparnis={kpis.behgErsparnis}
                kraftstoffMehrkosten={kpis.kraftstoffMehrkosten}
              />
              <PreisszenarienChart basisQuotenPreis={inputs.quotenPreisCent} literJahr={literJahr} />
            </section>
          </>
        )}

        {activeTab === 'finanzen' && (
          <FinanzenTab
            thgErloese={kpis.thgErloese}
            behgErsparnis={kpis.behgErsparnis}
            kraftstoffMehrkosten={kpis.kraftstoffMehrkosten}
            nettoVorteil={kpis.nettoVorteil}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <p>CO₂-Steuer-Befreiung (BEHG) in Ct./L Ersparnis tagesaktuell. Kein Rechts- oder Steuerberatung.</p>
      </footer>
    </div>
  )
}
