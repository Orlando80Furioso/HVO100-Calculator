import React from 'react'
import styles from './CalculatorForm.module.css'

export function CalculatorForm({ inputs, onChange }) {
  const { anzahlBusse, anzahlElektrisch = 0, laufleistungKm, literPro100Km, quotenPreisEurProTonne } = inputs
  const maxElektrisch = Math.max(0, Number(anzahlBusse) || 0)

  return (
    <section className={styles.section} aria-label="Eingabeparameter">
      <h2 className={styles.title}>Eingabeparameter</h2>
      <div className={styles.grid}>
        <label className={styles.label}>
          <span className={styles.labelText}>Anzahl Busse (gesamt)</span>
          <input
            type="number"
            min={1}
            max={10000}
            value={anzahlBusse}
            onChange={(e) => onChange('anzahlBusse', Number(e.target.value) || 0)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>davon vollelektrisch</span>
          <input
            type="number"
            min={0}
            max={maxElektrisch}
            value={Math.min(anzahlElektrisch, maxElektrisch)}
            onChange={(e) => onChange('anzahlElektrisch', Math.min(maxElektrisch, Math.max(0, Number(e.target.value) || 0)))}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Laufleistung (km/Jahr)</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={laufleistungKm}
            onChange={(e) => onChange('laufleistungKm', Number(e.target.value) || 0)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Dieselverbrauch (L/100 km)</span>
          <input
            type="number"
            min={1}
            max={100}
            step={0.1}
            value={literPro100Km}
            onChange={(e) => onChange('literPro100Km', Number(e.target.value) || 0)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Quotenpreis (€/t CO₂)</span>
          <input
            type="number"
            min={0}
            step={10}
            value={quotenPreisEurProTonne}
            onChange={(e) => onChange('quotenPreisEurProTonne', Number(e.target.value) || 0)}
            className={styles.input}
          />
        </label>
      </div>
    </section>
  )
}
