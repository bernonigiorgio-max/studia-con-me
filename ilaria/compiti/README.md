# Compiti di Ilaria

Pianificatore dei compiti: raccogli tutto in un elenco, sposta ogni compito nel
giorno in cui va davvero fatto, spunta quando è finito.

URL: <https://bernonigiorgio-max.github.io/studia-con-me/ilaria/compiti/>

## Com'è fatto

| Pezzo | File | Cosa fa |
|---|---|---|
| App | `index.html` | Tutta l'interfaccia, un file solo |
| Backend | `apps-script.gs` | Opzionale: da incollare in Google Apps Script per sincronizzare |
| PWA | `manifest.webmanifest`, `sw.js`, `icon-*.png` | Installazione sulla home di Android e funzionamento offline |

Senza foglio collegato i dati stanno solo nel browser del dispositivo.
Collegandolo, stanno in **un Google Foglio nel Drive di chi installa lo script**.
Chi usa l'app non deve avere un account Google né ricevere condivisioni: le
richieste arrivano anonime e lo script le esegue a nome del proprietario.

## Primo avvio

Apri il link e premi **Inizia subito**. L'app funziona da quel momento, sul
dispositivo che hai in mano, senza configurare niente: i compiti restano nel
browser.

Il Google Foglio serve solo quando vuoi vedere gli stessi compiti da più
dispositivi. Si collega dopo, e i compiti già inseriti ci finiscono dentro da
soli.

## Collegare il Google Foglio (opzionale, per sincronizzare)

**Impostazioni → Sincronizzazione** mostra i passi con il token già generato e
un pulsante che copia il codice pronto da incollare. In sintesi:

1. [sheets.new](https://sheets.new) → un Foglio Google vuoto, chiamalo `Compiti Ilaria`
2. **Estensioni → Apps Script**, cancella il codice di esempio
3. **Copia il codice** dall'app e incollalo lì (il token è già dentro), salva
4. **Distribuisci → Nuova distribuzione**, ingranaggio → **App web**
5. *Esegui come*: **Io** · *Chi ha accesso*: **Chiunque** → **Distribuisci**
6. Autorizza: all'avviso "app non verificata" → **Avanzate → Apri progetto
   (non sicuro) → Consenti**. Lo script è il tuo
7. Copia l'URL che finisce con `/exec` e incollalo nell'app

I due fogli `Compiti` e `Config` si creano da soli al primo salvataggio.
Il file `apps-script.gs` in questa cartella è la stessa sorgente che il
pulsante copia, con il segnaposto `TOKEN` al posto di quello generato.

## Darla agli altri

Funziona solo dopo aver collegato il foglio. Impostazioni → **Copia link**:
il link contiene già URL e token, chi lo apre si ritrova l'app configurata
senza digitare niente. Poi dal browser Android: *menu ⋮ → Aggiungi a
schermata Home*.

Il token viene tolto dalla barra degli indirizzi appena letto e salvato in
locale, così non resta nella cronologia.

## Incolla da Nuvola

Il pulsante **📋 Da Nuvola**, nell'intestazione di *In arrivo*, apre un box in
cui incollare il testo copiato da Nuvola (Compiti, vista settimana,
seleziona tutto).

Nuvola si copia in due modi, a seconda di come si seleziona, e vanno bene
entrambi:

| | Intestazione del giorno | Data |
|---|---|---|
| Testo semplice | `lun` e `21` su due righe | assente, viene dedotta |
| Con i collegamenti | `lun[21](…?data=2026-09-21…)` | dentro il link |

Senza data scritta, le date si ricavano agganciando la prima intestazione al
giorno più vicino a oggi con quel nome e quel numero, e proseguendo in avanti:
i cambi di mese e di anno tornano da soli. I due formati producono gli stessi
identificativi, quindi passare dall'uno all'altro non crea doppioni.

L'ancora del riconoscimento è la riga `Compiti assegnati …`, che ogni compito
ha esattamente una volta: da lì si risale alla materia (l'ultima riga in
maiuscolo sopra), al testo e all'argomento collegato. Regge righe vuote in
più, il nome del docente mancante, materie non in maiuscolo e l'assenza
dell'argomento.

Premendo **Elabora** compare l'anteprima divisa in due:

- **Da aggiungere** — i compiti dei giorni successivi a oggi, mai importati
- **Scartati** — in rosso e barrati, con il motivo: *giorno già passato*,
  *è oggi*, *già importato*, *importato prima, poi eliminato*

Niente viene buttato via senza dirlo: ogni voce si tocca per invertirla,
quindi uno scartato si recupera e un incluso si esclude. Poi **Aggiungi**.

I compiti arrivano in *In arrivo* con il giorno di consegna nel titolo
(`MATEMATICA · da portare gio 24 set`) e senza giorno di svolgimento: quello
lo assegni tu, come per i compiti inseriti a mano.

Reincollare lo stesso testo il giorno dopo non crea doppioni: l'identificativo
di ogni compito deriva dal suo contenuto, quindi quelli già visti risultano
*già importato*. Un compito ripescato fra gli scartati non perde il giorno
assegnato né le note che ci avevi scritto.

## Uso

- **In arrivo** — compiti senza giorno assegnato. Il `+` in basso ne aggiunge
  uno a mano (quelli dettati sul diario), il **📋 Da Nuvola** ne importa in blocco.
  Spuntandone uno non sparisce: scende in fondo barrato, e ritogliendo la spunta
  torna dov'era. Il contatore conta solo quelli ancora da smistare.
- **🗑 Cestino** (Impostazioni) — i compiti eliminati e quelli archiviati
  restano qui finché non lo svuoti. **Ripristina** li riporta in *In arrivo*;
  **Svuota il cestino** li elimina per sempre, con conferma.
- **Note personali** — campo libero su ogni compito, per quello che serve a te:
  *lo fa con Giusy alle 18*, *versione DSA*, *deve solo ripassare*. Compare
  sulla card sotto il testo e non viene toccato dalle importazioni successive.
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

Senza foglio collegato non c'è sincronizzazione: i compiti vivono nel browser
di quel dispositivo e basta. Collegandolo più tardi, quelli già inseriti
vengono spinti sul foglio al primo salvataggio.

Backup: con il foglio, il foglio stesso e la sua cronologia versioni di
Google. Sempre disponibile Impostazioni → **Esporta JSON**.

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
| `note` | note personali, scritte da te nell'editor |
| `deleted` | cancellazione logica, ripulita dopo 60 giorni |

I compiti importati da Nuvola hanno `fonte = "nuvola"`, `giorno = ""`,
`dataOriginale` con la data di consegna e un `id` della forma
`nuvola-<impronta>` derivato da data, materia e testo: è quello che rende
riconoscibili i doppioni fra un incollaggio e il successivo.
