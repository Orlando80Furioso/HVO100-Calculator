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
const CYAN = '#22d3ee'
const SLATE = '#64748b'
const AMBER = '#f59e0b'
const AXIS_TICK_FILL = '#94a3b8'
const TOOLTIP_STYLE = { background: '#132033', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#f1f5f9' }

export function EmissionsvergleichChart({ dieselKg, hvoKg, co2EinsparungEBusKg = 0 }) {
  const [unit, setUnit] = React.useState('kg')
  const isTonnen = unit === 't'
  const dieselVal = isTonnen ? Math.round((dieselKg / 1000) * 100) / 100 : Math.round(dieselKg)
  const hvoVal = isTonnen ? Math.round((hvoKg / 1000) * 100) / 100 : Math.round(hvoKg)
  const eBusVal = co2EinsparungEBusKg > 0
    ? (isTonnen ? Math.round((co2EinsparungEBusKg / 1000) * 100) / 100 : Math.round(co2EinsparungEBusKg))
    : null
  const data = [
    { name: 'Diesel', emissionen: dieselVal, fill: SLATE },
    { name: 'HVO100', emissionen: hvoVal, fill: EMERALD },
    ...(eBusVal != null ? [{ name: 'E-Busse (eingespart)', emissionen: eBusVal, fill: BLUE }] : []),
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
          <XAxis dataKey="name" stroke={AXIS_TICK_FILL} tick={{ fill: AXIS_TICK_FILL }} fontSize={12} />
          <YAxis stroke={AXIS_TICK_FILL} tick={{ fill: AXIS_TICK_FILL }} fontSize={12} unit={isTonnen ? ' t' : ' kg'} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [formatTooltip(v), 'Emissionen']} />
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

export function EinsparungsaufschlüsselungChart({ thgErloese, thgErloeseEBus = 0, behgErsparnis, kraftstoffMehrkosten }) {
  let data = [
    { name: 'THG (HVO)', value: Math.max(0, thgErloese), fill: EMERALD },
    ...(thgErloeseEBus > 0 ? [{ name: 'THG (E-Busse)', value: thgErloeseEBus, fill: CYAN }] : []),
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
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${Number(v).toFixed(2)} €`, '']} />
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
          <XAxis dataKey="quotenPreis" stroke={AXIS_TICK_FILL} tick={{ fill: AXIS_TICK_FILL }} fontSize={12} unit=" €/t" />
          <YAxis stroke={AXIS_TICK_FILL} tick={{ fill: AXIS_TICK_FILL }} fontSize={12} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} €`, 'THG-Erlöse']} />
          <Line type="monotone" dataKey="thgErloese" stroke={EMERALD} strokeWidth={2} dot={{ fill: EMERALD }} name="THG-Erlöse" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
