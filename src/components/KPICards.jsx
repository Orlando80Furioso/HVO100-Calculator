import React from 'react'
import styles from './KPICards.module.css'

const formatEuro = (v) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
const formatNumber = (v, decimals = 0) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v)

export function KPICards({ kpis }) {
  const cards = [
    {
      label: 'THG-Quote Erlöse',
      value: formatEuro(kpis.thgErloese),
      sub: 'pro Jahr',
      accent: 'emerald',
    },
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
