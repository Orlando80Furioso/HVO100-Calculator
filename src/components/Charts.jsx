import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  const data = [
    { name: 'Diesel', emissionen: Math.round(dieselKg), fill: SLATE },
    { name: 'HVO100', emissionen: Math.round(hvoKg), fill: EMERALD },
  ]
  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>CO₂-Emissionen (kg/Jahr)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.15)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ background: '#132033', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8 }}
            formatter={(v) => [`${v} kg CO₂`, 'Emissionen']}
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

export function PreisszenarienChart({ basisQuotenPreis, literJahr }) {
  const preise = [20, 30, 40, 50, 60, basisQuotenPreis].filter((p, i, a) => a.indexOf(p) === i).sort((a, b) => a - b)
  const data = preise.map((p) => {
    const thgEuro = ((0.9 * literJahr) / 1000) * (p / 100)
    return { quotenPreis: p, thgErloese: Math.round(thgEuro) }
  })
  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>THG-Erlöse bei verschiedenen Quotenpreisen (Ct.)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.15)" />
          <XAxis dataKey="quotenPreis" stroke="#94a3b8" fontSize={12} unit=" Ct." />
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
