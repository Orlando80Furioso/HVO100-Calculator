import React from 'react'
import styles from './KPICards.module.css'

const formatEuro = (v) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
const formatNumber = (v, decimals = 0) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v)
const formatKg = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)} t` : `${Math.round(v)} kg`)

export function KPICards({ kpis }) {
  const hasEBus = (kpis.thgErloeseEBus ?? 0) > 0 || (kpis.co2EinsparungEBusKg ?? 0) > 0
  const cards = [
    {
      label: 'THG-Quote Erlöse',
      value: formatEuro(kpis.thgErloeseGesamt ?? kpis.thgErloese),
      sub: hasEBus ? `HVO: ${formatEuro(kpis.thgErloese)} · E-Busse: ${formatEuro(kpis.thgErloeseEBus)}` : 'pro Jahr',
      accent: 'emerald',
    },
    ...(hasEBus
      ? [
          {
            label: 'CO₂-Einsparung E-Busse',
            value: formatKg(kpis.co2EinsparungEBusKg ?? 0),
            sub: 'vermiedene Emissionen pro Jahr',
            accent: 'blue',
          },
        ]
      : []),
    {
      label: 'CO₂-Steuer-Ersparnis (BEHG)',
      value: formatEuro(kpis.behgErsparnis),
      sub: `inkl. ${formatNumber(kpis.behgCentProLiter, 2)} Ct./L Ersparnis`,
      accent: 'blue',
    },
    {
      label: 'Kraftstoff-Mehrkosten',
      value: formatEuro(kpis.kraftstoffMehrkosten),
      sub: 'HVO100 vs. Diesel',
      accent: 'neutral',
    },
    {
      label: 'Nettovorteil',
      value: formatEuro(kpis.nettoVorteil),
      sub: kpis.nettoVorteil >= 0 ? 'pro Jahr' : 'Nachteil',
      accent: kpis.nettoVorteil >= 0 ? 'emerald' : 'warning',
    },
  ]

  return (
    <div className={styles.wrapper} role="region" aria-label="KPI-Übersicht">
      {cards.map((card) => (
        <div key={card.label} className={`${styles.card} ${styles[card.accent]}`}>
          <span className={styles.label}>{card.label}</span>
          <span className={styles.value}>{card.value}</span>
          <span className={styles.sub}>{card.sub}</span>
        </div>
      ))}
    </div>
  )
}
