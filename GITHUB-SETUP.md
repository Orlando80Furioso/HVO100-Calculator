# Mit GitHub online stellen

## 1. Repository auf GitHub anlegen

1. Auf **https://github.com** einloggen.
2. Oben rechts **„+“** → **„New repository“**.
3. Repository-Name: **`hvo100-calculator`** (oder anderer Name).
4. **Public** lassen, **keine** README, .gitignore oder Lizenz anlegen (projekt hat schon .gitignore).
5. **„Create repository“** klicken.

---

## 2. Projekt von deinem PC zu GitHub pushen

Im Terminal im Projektordner ausführen (eine Zeile nach der anderen):

```bash
cd C:\Users\PCUser\hvo100-calculator
git init
git add .
git commit -m "HVO100 Erlös-Kalkulator – initial"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/hvo100-calculator.git
git push -u origin main
```

**Wichtig:** `DEIN-USERNAME` durch deinen echten GitHub-Benutzernamen ersetzen (z. B. `max-mustermann`).  
Die Repo-URL siehst du auf der GitHub-Seite nach dem Anlegen unter „Quick setup“.

Falls GitHub nach Passwort fragt: **Personal Access Token** verwenden (Settings → Developer settings → Personal access tokens), nicht dein normales Passwort.

---

## 3. Bei Vercel deployen

1. Auf **https://vercel.com** gehen und mit **GitHub** anmelden.
2. **„Add New…“** → **„Project“**.
3. **„Import“** beim Repository **hvo100-calculator** klicken.
4. Einstellungen so lassen (Build: `npm run build`, Output: `dist`).
5. **„Deploy“** klicken.

Nach 1–2 Minuten ist die App online, z. B. unter:
`https://hvo100-calculator-dein-username.vercel.app`

---

## Spätere Updates

Nach Änderungen im Code:

```bash
cd C:\Users\PCUser\hvo100-calculator
git add .
git commit -m "Beschreibung der Änderung"
git push
```

Vercel baut und veröffentlicht automatisch nach jedem `git push` auf `main`.
