# Eldritch Hunt — Compendio della Campagna

Web app statica in stile gotico vittoriano per la campagna di D&D **Eldritch Hunt**, ottimizzata per smartphone e pensata per essere pubblicata su **GitHub Pages**.

---

## Struttura del progetto

```
Eldritch Hunt/
├── index.html          # Pagina unica (menu + sezioni)
├── styles.css          # Stile gotico vittoriano (oro / avorio / cremisi)
├── app.js              # Router interno + caricamento markdown
├── README.md           # Questo file
└── content/
    ├── Razze.md        # Già popolato
    ├── Sottoclassi.md  # Vuoto (segnaposto)
    ├── Backgrounds.md  # Vuoto (segnaposto)
    ├── Missioni.md     # Vuoto (segnaposto)
    └── Regole.md       # Vuoto (segnaposto)
```

L'app è un **single-page** con routing tramite hash (`#/razze`, `#/sottoclassi`, …). Ogni voce del menu carica il file `.md` corrispondente al volo.

---

## Come aggiungere o aggiornare contenuti

Apri uno dei file in `content/` con un editor di testo e scrivi in **Markdown**. L'app si aggiorna automaticamente.

### Convenzioni di formattazione

L'app riconosce alcune piccole convenzioni che danno il massimo dello stile:

| Sintassi markdown | Resa nell'app |
|---|---|
| `## Nome` | Nuova **scheda espandibile** (accordion). |
| `---` | Separatore opzionale fra schede. |
| `*Testo.* descrizione` | Riga di **statistica** (etichetta in oro). |
| `**Nome Abilità.** descrizione` | Box **abilità** con accento cremisi. |
| `- voce` | Punto elenco con fregio dorato. |
| `IMAGE.PNG` (su una riga) | Segnaposto stilizzato per illustrazione. |

### Esempio minimo

```markdown
## Nome della Razza
Paragrafo introduttivo, scritto in prosa. La prima lettera del primo
paragrafo riceverà automaticamente un'iniziale gotica decorata.

IMAGE.PNG

*Aumento dei punteggi di caratteristica.* Il tuo punteggio di X aumenta di 2.

*Velocità.* La tua velocità base di movimento è di 30ft.

**Abilità Speciale.** Descrizione dell'abilità che il personaggio possiede.

**Sottorazze.** Scegline una:
- *Sottorazza Alpha.* Descrizione.
  - Un beneficio aggiuntivo.
- *Sottorazza Beta.* Descrizione.

---

## Nome della Razza Successiva
…
```

### Aggiungere un'illustrazione

Quando avrai un'immagine reale, sostituisci `IMAGE.PNG` con la classica sintassi markdown puntando al file (mettilo per esempio in `content/img/`):

```markdown
![Tiefling Maledetto](img/tiefling.png)
```

---

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub (es. `eldritch-hunt`) e carica tutti i file di questa cartella nella radice.
2. Vai su **Settings → Pages**.
3. Sotto *Source* seleziona **Deploy from a branch**, branch **main**, cartella **/(root)**.
4. Salva. Dopo qualche secondo l'app sarà disponibile su `https://<tuo-utente>.github.io/eldritch-hunt/`.

> ⚠️ Apri il file `index.html` **tramite GitHub Pages** (o un piccolo server locale come `python -m http.server`). Aprendolo direttamente come `file://` dal disco i browser bloccano il `fetch()` dei file `.md` per motivi di sicurezza.

### Test in locale

Da terminale, dentro la cartella del progetto:

```bash
python -m http.server 8000
```

Poi apri `http://localhost:8000/` sul telefono o sul browser.

---

## Personalizzazione rapida

I colori sono raccolti in cima a `styles.css` come *custom properties*:

```css
:root {
  --gold:           #c9a961;
  --gold-bright:    #e6c87a;
  --crimson:        #8b1a1a;
  --crimson-bright: #b22222;
  --ivory:          #f4e9d3;
  /* ... */
}
```

Modifica un valore e l'intera app si adegua.

---

*« Quando la Luna di Sangue sorge, anche le pietre tacciono. »*
