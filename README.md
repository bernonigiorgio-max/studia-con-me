# studia-con-me

Web app interattive per aiutare le figlie a studiare — ospitate su [GitHub Pages](https://bernonigiorgio-max.github.io/studia-con-me/).

## Struttura

```
studia-con-me/
├── index.html            ← hub principale (Ilaria, Emma, Decisioni)
├── ilaria/               ← app di studio di Ilaria (5ª elementare)
│   ├── index.html
│   └── scienze/
│       ├── sistema-scheletrico.html
│       └── cardiocircolatorio.html
├── emma/                 ← app di studio di Emma (3ª elementare)
│   └── index.html
└── decisioni/            ← strumenti decisionali della famiglia (Σ voto × peso)
    ├── index.html
    └── emma-sport.html
```

## Come aggiungere una nuova app

1. Crea il file HTML (con Claude, skill `giochi-figlie`)
2. Caricalo nella cartella giusta, es. `ilaria/matematica/nome-app.html`
3. GitHub Pages la pubblica automaticamente
4. Aggiungi il link nella pagina indice corrispondente e su Notion
