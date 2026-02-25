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
  busseMitKraftstoff,
  co2EinsparungDurchEBusseKg,
  thgQuoteErloeseEBus,
} from './lib/calculator.js'
import { CalculatorForm } from './components/CalculatorForm.jsx'
import { KPICards } from './components/KPICards.jsx'
import { EmissionsvergleichChart, EinsparungsaufschlüsselungChart, PreisszenarienChart } from './components/Charts.jsx'
import { FinanzenTab } from './components/FinanzenTab.jsx'
import styles from './App.module.css'

const DEFAULT_INPUTS = {
  anzahlBusse: 50,
  anzahlElektrisch: 0,
  laufleistungKm: 45000,
  literPro100Km: 38,
  quotenPreisEurProTonne: 120,
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
      const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_TANKERKOENIG_API_KEY
      const data = await fetchMarketData({ tankerkoenigApiKey: apiKey })
      setMarket(data)
      setLastUpdated(data.lastUpdated)
      setInputs((prev) => ({ ...prev, quotenPreisEurProTonne: data.thgQuotenPreisEurProTonne }))
    } finally {
      setMarketLoading(false)
    }
  }

  useEffect(() => {
    loadMarket()
  }, [])

  const behgCent = market ? getBehgCentPerLiter(market) : 8.16
  const quotenPreis = market ? getThgQuotenPreis(market) : inputs.quotenPreisEurProTonne
  const dieselPreis = market?.dieselPreisCentProLiter ?? 168.5
  const hvoPreis = market?.hvo100PreisCentProLiter ?? 182

  const { kpis, literJahr, dieselKg, hvoKg, co2EinsparungEBusKg } = useMemo(() => {
    const anzahlBusse = Number(inputs.anzahlBusse) || 0
    const anzahlElektrisch = Math.min(Math.max(0, Number(inputs.anzahlElektrisch) || 0), anzahlBusse)
    const busseKraftstoff = busseMitKraftstoff(anzahlBusse, anzahlElektrisch)
    const liter = dieselVerbrauchProJahr(busseKraftstoff, inputs.laufleistungKm, inputs.literPro100Km)
    const thgHvo = thgQuoteErloese(liter, inputs.quotenPreisEurProTonne)
    const thgEBus = thgQuoteErloeseEBus(anzahlElektrisch, inputs.laufleistungKm, inputs.literPro100Km, inputs.quotenPreisEurProTonne)
    const behg = behgErsparnisEuro(liter, behgCent)
    const mehrkosten = kraftstoffMehrkostenEuro(liter, dieselPreis, hvoPreis)
    const netto = nettoVorteilEuro(thgHvo + thgEBus, behg, mehrkosten)
    const co2EBus = co2EinsparungDurchEBusseKg(anzahlElektrisch, inputs.laufleistungKm, inputs.literPro100Km)
    return {
      literJahr: liter,
      dieselKg: co2DieselKg(liter),
      hvoKg: co2HvoKg(liter),
      co2EinsparungEBusKg: co2EBus,
      kpis: {
        thgErloese: thgHvo,
        thgErloeseEBus: thgEBus,
        thgErloeseGesamt: thgHvo + thgEBus,
        behgErsparnis: behg,
        behgCentProLiter: behgCent,
        kraftstoffMehrkosten: mehrkosten,
        nettoVorteil: netto,
        co2EinsparungEBusKg: co2EBus,
      },
    }
  }, [inputs, behgCent, dieselPreis, hvoPreis])

  const handleInputChange = (key, value) => {
    setInputs((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'anzahlBusse' && (next.anzahlElektrisch ?? 0) > (Number(value) || 0)) {
        next.anzahlElektrisch = Math.max(0, Number(value) || 0)
      }
      return next
    })
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
                Stand: {formatMarketDate(lastUpdated)} · Diesel/HVO: Mönchengladbach · BEHG: {behgCent.toFixed(2)} Ct./L
              </span>
            )}
            {market?.source === 'tankerkoenig_mg' && (
              <span className={styles.dataSource}>Tankerkönig</span>
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
              <EmissionsvergleichChart dieselKg={dieselKg} hvoKg={hvoKg} co2EinsparungEBusKg={co2EinsparungEBusKg} />
              <EinsparungsaufschlüsselungChart
                thgErloese={kpis.thgErloese}
                thgErloeseEBus={kpis.thgErloeseEBus}
                behgErsparnis={kpis.behgErsparnis}
                kraftstoffMehrkosten={kpis.kraftstoffMehrkosten}
              />
              <PreisszenarienChart basisQuotenPreis={inputs.quotenPreisEurProTonne} literJahr={literJahr} />
            </section>
          </>
        )}

        {activeTab === 'finanzen' && (
          <FinanzenTab
            thgErloese={kpis.thgErloese}
            thgErloeseEBus={kpis.thgErloeseEBus}
            thgErloeseGesamt={kpis.thgErloeseGesamt}
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
