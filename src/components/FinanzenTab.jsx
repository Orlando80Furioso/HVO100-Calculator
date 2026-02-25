import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import styles from './FinanzenTab.module.css'

const EMERALD = '#10b981'
const BLUE = '#3b82f6'
const CYAN = '#22d3ee'
const AMBER = '#f59e0b'

const formatEuro = (v) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

export function FinanzenTab({ thgErloese, thgErloeseEBus = 0, thgErloeseGesamt, behgErsparnis, kraftstoffMehrkosten, nettoVorteil }) {
  const total = thgErloeseGesamt ?? thgErloese
  const data = [
    { name: 'THG-Quote (HVO)', value: thgErloese, fill: EMERALD },
    ...(thgErloeseEBus > 0 ? [{ name: 'THG-Quote (E-Busse)', value: thgErloeseEBus, fill: CYAN }] : []),
    { name: 'CO₂-Steuer-Ersparnis', value: behgErsparnis, fill: BLUE },
    { name: 'Kraftstoff-Mehrkosten', value: -kraftstoffMehrkosten, fill: AMBER },
  ]

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Finanzen-Aufschlüsselung</h2>
      <p className={styles.subtitle}>
        Darstellung der jährlichen Effekte: THG-Quote-Erlöse (HVO + E-Busse), BEHG-Ersparnis und Kraftstoff-Mehrkosten.
      </p>
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>THG-Quote-Erlöse (HVO)</span>
          <span className={styles.summaryValuePositive}>{formatEuro(thgErloese)}</span>
        </div>
        {thgErloeseEBus > 0 && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>THG-Quote-Erlöse (E-Busse)</span>
            <span className={styles.summaryValuePositive}>{formatEuro(thgErloeseEBus)}</span>
          </div>
        )}
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>CO₂-Steuer-Ersparnis (BEHG)</span>
          <span className={styles.summaryValuePositive}>{formatEuro(behgErsparnis)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Kraftstoff-Mehrkosten</span>
          <span className={styles.summaryValueNegative}>{formatEuro(-kraftstoffMehrkosten)}</span>
        </div>
        <hr className={styles.hr} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Nettovorteil</span>
          <span className={nettoVorteil >= 0 ? styles.summaryValuePositive : styles.summaryValueNegative}>
            {formatEuro(nettoVorteil)}
          </span>
        </div>
      </div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical" margin={{ top: 12, right: 24, left: 120, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.15)" />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v} €`} />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={110} />
            <Tooltip
              contentStyle={{ background: '#132033', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8 }}
              formatter={(v) => [formatEuro(typeof v === 'number' ? v : 0), '']}
            />
            <Legend />
            <Bar dataKey="value" name="Betrag (€)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
