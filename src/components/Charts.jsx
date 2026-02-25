import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import styles from './Charts.module.css'

const EMERALD = '#10b981'
const BLUE = '#3b82f6'
const SLATE = '#64748b'
const AMBER = '#f59e0b'

export function EmissionsvergleichChart({ dieselKg, hvoKg }) {
  const [unit, setUnit] = React.useState('kg')
  const isTonnen = unit === 't'
  const dieselVal = isTonnen ? Math.round((dieselKg / 1000) * 100) / 100 : Math.round(dieselKg)
  const hvoVal = isTonnen ? Math.round((hvoKg / 1000) * 100) / 100 : Math.round(hvoKg)
  const data = [
    { name: 'Diesel', emissionen: dieselVal, fill: SLATE },
    { name: 'HVO100', emissionen: hvoVal, fill: EMERALD },
  ]
  const formatTooltip = (v) => (isTonnen ? `${Number(v).toFixed(2)} t CO₂` : `${v} kg CO₂`)
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>CO₂-Emissionen</h3>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={unit === 'kg' ? styles.unitActive : styles.unitBtn}
            onClick={() => setUnit('kg')}
          >
            kg/Jahr
          </button>
          <button
            type="button"
            className={unit === 't' ? styles.unitActive : styles.unitBtn}
            onClick={() => setUnit('t')}
          >
            t/Jahr
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.15)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} unit={isTonnen ? ' t' : ' kg'} />
          <Tooltip
            contentStyle={{ background: '#132033', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8 }}
            formatter={(v) => [formatTooltip(v), 'Emissionen']}
          />
          <Bar dataKey="emissionen" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function EinsparungsaufschlüsselungChart({ thgErloese, behgErsparnis, kraftstoffMehrkosten }) {
  let data = [
    { name: 'THG-Quote', value: Math.max(0, thgErloese), fill: EMERALD },
    { name: 'BEHG-Ersparnis', value: Math.max(0, behgErsparnis), fill: BLUE },
    { name: 'Kraftstoff-Mehrkosten', value: Math.abs(kraftstoffMehrkosten), fill: AMBER },
  ].filter((d) => d.value > 0)
  if (data.length === 0) {
    data = [{ name: 'Keine Daten', value: 1, fill: SLATE }]
  }
  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Finanz-Aufschlüsselung (€/Jahr)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: ${value.toFixed(0)} €`}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#132033', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8 }}
            formatter={(v) => [`${Number(v).toFixed(2)} €`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const CO2_MINDERUNG_T_PRO_LITER = (2.65 - 0.2) / 1000

export function PreisszenarienChart({ basisQuotenPreis, literJahr }) {
  const preise = [200, 300, 400, 500, 600, basisQuotenPreis].filter((p, i, a) => a.indexOf(p) === i).sort((a, b) => a - b)
  const data = preise.map((p) => {
    const thgEuro = literJahr * CO2_MINDERUNG_T_PRO_LITER * p
    return { quotenPreis: p, thgErloese: Math.round(thgEuro) }
  })
  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>THG-Erlöse bei verschiedenen Quotenpreisen (€/t CO₂)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.15)" />
          <XAxis dataKey="quotenPreis" stroke="#94a3b8" fontSize={12} unit=" €/t" />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ background: '#132033', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8 }}
            formatter={(v) => [`${v} €`, 'THG-Erlöse']}
          />
          <Line type="monotone" dataKey="thgErloese" stroke={EMERALD} strokeWidth={2} dot={{ fill: EMERALD }} name="THG-Erlöse" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
