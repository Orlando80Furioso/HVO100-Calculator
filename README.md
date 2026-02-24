# HVO100 Erlös-Kalkulator

Web-App zur Echtzeit-Kalkulation von **THG-Quoten-Erlösen**, **CO₂-Steuer-Ersparnis (BEHG)** und **Kraftstoff-Mehrkosten** bei Umstellung auf HVO100.

## Features

- **Vier anpassbare Eingaben:** Anzahl Busse, Laufleistung (km/Jahr), Dieselverbrauch (L/100 km), Quotenpreis
- **Vier KPI-Karten:** THG-Quote Erlöse, BEHG-Ersparnis, Kraftstoff-Mehrkosten, Nettovorteil (Live)
- **Drei Visualisierungen:** CO₂-Emissionsvergleich (Diesel vs. HVO100), Einsparungsaufschlüsselung (Pie), Preisszenarien (Linie)
- **Finanzen-Tab:** Aufschlüsselung THG-Quote-Erlöse, CO₂-Steuer-Ersparnis, Kraftstoff-Mehrkosten + Balkendiagramm
- **Tagesaktuelle Marktdaten:** Button „Aktualisieren“ ruft (simulierte) tagesaktuelle Preise ab; BEHG in Ct./L Ersparnis wird angezeigt
- **Design:** Emerald-Green/Blue Farbschema, moderne UI

## Technik

- **Frontend:** React 18, Vite 5, Recharts
- **Marktdaten:** `src/lib/market.js` (Market Router) – tagesaktuelle Werte (in Produktion durch echte API ersetzen)
- **Tests:** Vitest; 5 Tests für den Market Router in `src/lib/market.test.js`

## Installation & Start

```bash
cd hvo100-calculator
npm install
npm run dev
```

Öffnen: `http://localhost:5173`

## Tests (Market Router)

```bash
npm run test
```

Es werden 5 Vitest-Tests für den Market Router ausgeführt (Struktur der Marktdaten, Fallbacks, Validierung, Datumsformatierung).

## Build

```bash
npm run build
npm run preview
```

## Online stellen (Deployment)

Die App ist als statische SPA gebaut und kann z. B. bei **Vercel** oder **Netlify** kostenlos gehostet werden.

**→ Schritt-für-Schritt mit GitHub: siehe [GITHUB-SETUP.md](GITHUB-SETUP.md)**

### Option A: Vercel (empfohlen)

1. Code in ein **GitHub-Repository** pushen (falls noch nicht geschehen):
   ```bash
   git init
   git add .
   git commit -m "HVO100 Kalkulator"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/hvo100-calculator.git
   git push -u origin main
   ```
2. Auf [vercel.com](https://vercel.com) gehen, mit GitHub anmelden.
3. **„Add New Project“** → Repository `hvo100-calculator` auswählen.
4. Vercel erkennt Vite automatisch (Build: `npm run build`, Output: `dist`). Mit **Deploy** starten.
5. Fertig: Die App ist unter einer URL wie `https://hvo100-calculator-xxx.vercel.app` erreichbar.

### Option B: Netlify

1. Code auf GitHub pushen (siehe oben).
2. Auf [netlify.com](https://netlify.com) gehen, mit GitHub anmelden.
3. **„Add new site“ → „Import an existing project“** → Repository wählen.
4. Build-Einstellungen (bereits in `netlify.toml` hinterlegt):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Deploy** starten. Die App erhält eine URL wie `https://… .netlify.app`.

### Option C: Manuell (z. B. eigener Server)

```bash
npm run build
```

Den Inhalt des Ordners **`dist`** auf einen beliebigen Webserver (Apache, nginx, etc.) kopieren und das Root-Verzeichnis auf `dist` zeigen. Für SPAs muss die Server-Konfiguration alle Routen auf `index.html` umleiten (in `netlify.toml` ist das bereits vorgegeben; bei Vercel passiert das automatisch).

---

*Hinweis: CO₂-Steuer (BEHG) und Quotenpreise sind tagesaktuell abrufbar; keine Rechts- oder Steuerberatung.*
