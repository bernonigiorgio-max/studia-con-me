# Compiti di Ilaria

Pianificatore dei compiti: raccogli tutto in un elenco, sposta ogni compito nel
giorno in cui va davvero fatto, spunta quando è finito.

URL: <https://bernonigiorgio-max.github.io/studia-con-me/ilaria/compiti/>

## Com'è fatto

| Pezzo | File | Cosa fa |
|---|---|---|
| App | `index.html` | Tutta l'interfaccia, un file solo |
| Backend | `apps-script.gs` | Da incollare in Google Apps Script: legge e scrive il foglio |
| PWA | `manifest.webmanifest`, `sw.js`, `icon-*.png` | Installazione sulla home di Android e funzionamento offline |

I dati stanno in **un Google Foglio nel Drive di chi installa lo script**.
Chi usa l'app non deve avere un account Google né ricevere condivisioni: le
richieste arrivano anonime e lo script le esegue a nome del proprietario.

## Installazione (una volta sola)

1. Crea un Google Foglio nuovo, chiamalo `Compiti Ilaria`.
2. **Estensioni → Apps Script**, cancella quello che c'è, incolla tutto
   `apps-script.gs`.
3. Cambia la prima riga utile:
   ```js
   var TOKEN = 'una-parola-a-caso-tua';
   ```
   Chi non conosce questa parola non può leggere né scrivere.
4. **Distribuisci → Nuova distribuzione → App web**
   - *Esegui come*: **Me**
   - *Chi ha accesso*: **Chiunque**
5. Autorizza (Google avvisa che l'app non è verificata: è la tua, prosegui).
6. Copia l'URL che finisce con `/exec`.
7. Apri l'app, incolla URL e token, premi **Collega**.

I due fogli `Compiti` e `Config` si creano da soli al primo salvataggio.

## Darla agli altri

Impostazioni → **Copia link**. Il link contiene già URL e token: chi lo apre
si ritrova l'app configurata, senza digitare niente. Poi dal browser Android:
*menu ⋮ → Aggiungi a schermata Home*.

Il token viene tolto dalla barra degli indirizzi appena letto e salvato in
locale, così non resta nella cronologia.

## Uso

- **In arrivo** — compiti senza giorno assegnato. Il `+` in basso ne aggiunge
  uno a mano (quelli dettati sul diario).
- **Tap su un compito** → si apre la scheda con i giorni della settimana:
  un altro tap e il compito è spostato. Su computer funziona anche il
  trascinamento.
- **✦ Applica regole** — se hai impostato *geografia → lunedì*, sistema da solo
  tutti i compiti di quella materia rimasti in arrivo. Le regole si gestiscono
  in Impostazioni.
- **In ritardo** — i compiti non fatti con la data già passata restano nel loro
  giorno in rosso e vengono richiamati in cima. Non compaiono due volte: se il
  giorno è dentro la settimana che stai guardando, li vedi solo lì.
- **Oggi** — vista grande e pulita, pensata per Ilaria.

## Sincronizzazione

Ogni modifica parte verso il foglio dopo circa 0,7 secondi. Il server fonde per
singolo compito confrontando `updatedAt`, quindi due telefoni che salvano
insieme non si sovrascrivono a vicenda. Senza rete l'app continua a funzionare
sulla copia locale e risincronizza da sola quando torna online o quando
riapri la scheda.

Backup: il foglio stesso, con la cronologia versioni di Google. In più
Impostazioni → **Esporta JSON**.

## Schema del foglio `Compiti`

| Colonna | Contenuto |
|---|---|
| `id` | identificativo generato dall'app |
| `createdAt` / `updatedAt` | ISO 8601, servono al merge |
| `materia` | testo libero, decide il colore della card |
| `testo` | cosa deve fare |
| `dataOriginale` | il giorno per cui era stato assegnato |
| `giorno` | il giorno in cui lo fa davvero (vuoto = In arrivo) |
| `fatto` | TRUE / FALSE |
| `fonte` | `manuale`, `diario`, `nuvola` |
| `note` | libero |
| `deleted` | cancellazione logica, ripulita dopo 60 giorni |

Un eventuale importatore da Nuvola deve solo scrivere righe con
`fonte = "nuvola"`, `giorno = ""` e `dataOriginale` valorizzato: arrivano in
*In arrivo* pronte da smistare.
