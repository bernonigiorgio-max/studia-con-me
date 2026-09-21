/**
 * Compiti di Ilaria — backend Google Apps Script
 * ------------------------------------------------------------------
 * Da incollare in Extensions > Apps Script di un Google Foglio nuovo.
 * Poi: Deploy > New deployment > Web app
 *      - Execute as:    Me (il tuo account)
 *      - Who has access: Anyone
 * Copia l'URL /exec che ti restituisce: e' quello da mettere nell'app.
 *
 * Il foglio resta nel TUO Drive. Chi usa l'app non deve avere un account
 * Google ne' ricevere condivisioni: le richieste arrivano anonime e lo
 * script le esegue a nome tuo.
 * ------------------------------------------------------------------
 */

// Cambia questo valore con una stringa casuale tua (lettere e numeri).
// Chi non la conosce non puo' leggere ne' scrivere.
var TOKEN = 'CAMBIAMI-con-una-stringa-a-caso';

var SHEET_COMPITI = 'Compiti';
var SHEET_CONFIG  = 'Config';

var COLS = ['id','createdAt','updatedAt','materia','testo','dataOriginale',
            'giorno','fatto','fonte','note','deleted'];

// ── Utilità foglio ──────────────────────────────────────────────────

function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function sheetCompiti_() {
  var sh = ss_().getSheetByName(SHEET_COMPITI);
  if (!sh) {
    sh = ss_().insertSheet(SHEET_COMPITI);
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function sheetConfig_() {
  var sh = ss_().getSheetByName(SHEET_CONFIG);
  if (!sh) {
    sh = ss_().insertSheet(SHEET_CONFIG);
    sh.getRange('A1').setValue('regole');
    sh.getRange('B1').setValue('{}');
  }
  return sh;
}

function leggiCompiti_() {
  var sh = sheetCompiti_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var righe = sh.getRange(2, 1, last - 1, COLS.length).getValues();
  var out = [];
  for (var i = 0; i < righe.length; i++) {
    var r = righe[i];
    if (!r[0]) continue;
    var o = {};
    for (var c = 0; c < COLS.length; c++) o[COLS[c]] = r[c];
    o.fatto   = (o.fatto === true   || String(o.fatto).toLowerCase()   === 'true');
    o.deleted = (o.deleted === true || String(o.deleted).toLowerCase() === 'true');
    o.id = String(o.id);
    o.giorno = o.giorno ? normData_(o.giorno) : '';
    o.dataOriginale = o.dataOriginale ? normData_(o.dataOriginale) : '';
    out.push(o);
  }
  return out;
}

// Le celle data tornano come Date: le riportiamo a 'YYYY-MM-DD'.
function normData_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, ss_().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).trim();
}

function scriviCompiti_(lista) {
  var sh = sheetCompiti_();
  var last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, COLS.length).clearContent();
  if (!lista.length) return;
  var righe = lista.map(function (o) {
    return COLS.map(function (c) {
      var v = o[c];
      if (v === undefined || v === null) return '';
      if (c === 'giorno' || c === 'dataOriginale') return "'" + String(v); // testo, non data
      return v;
    });
  });
  sh.getRange(2, 1, righe.length, COLS.length).setValues(righe);
}

function leggiRegole_() {
  try { return JSON.parse(sheetConfig_().getRange('B1').getValue() || '{}'); }
  catch (e) { return {}; }
}

function scriviRegole_(regole) {
  sheetConfig_().getRange('B1').setValue(JSON.stringify(regole || {}));
}

// ── Endpoint ────────────────────────────────────────────────────────

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var t = (e && e.parameter && e.parameter.t) || '';
  if (t !== TOKEN) return json_({ ok: false, error: 'token' });
  return json_({
    ok: true,
    compiti: leggiCompiti_().filter(function (c) { return !c.deleted; }),
    regole: leggiRegole_(),
    ts: new Date().toISOString()
  });
}

/**
 * Riceve { t, compiti:[...], regole:{...} } e fa un MERGE per id:
 * vince la versione con updatedAt piu' recente. Cosi' due telefoni che
 * salvano insieme non si cancellano il lavoro a vicenda.
 */
function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return json_({ ok: false, error: 'json' }); }

  if (!body || body.t !== TOKEN) return json_({ ok: false, error: 'token' });

  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); }
  catch (err) { return json_({ ok: false, error: 'busy' }); }

  try {
    var correnti = leggiCompiti_();
    var mappa = {};
    correnti.forEach(function (c) { mappa[c.id] = c; });

    (body.compiti || []).forEach(function (inc) {
      if (!inc || !inc.id) return;
      inc.id = String(inc.id);
      var old = mappa[inc.id];
      if (!old || String(inc.updatedAt || '') >= String(old.updatedAt || '')) {
        mappa[inc.id] = {
          id: inc.id,
          createdAt: inc.createdAt || (old && old.createdAt) || new Date().toISOString(),
          updatedAt: inc.updatedAt || new Date().toISOString(),
          materia: inc.materia || '',
          testo: inc.testo || '',
          dataOriginale: inc.dataOriginale || '',
          giorno: inc.giorno || '',
          fatto: !!inc.fatto,
          fonte: inc.fonte || 'manuale',
          note: inc.note || '',
          deleted: !!inc.deleted
        };
      }
    });

    var fusi = Object.keys(mappa).map(function (k) { return mappa[k]; });
    // Butta via i cancellati piu' vecchi di 60 giorni, il foglio resta snello.
    var limite = new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString();
    fusi = fusi.filter(function (c) { return !c.deleted || String(c.updatedAt) > limite; });
    fusi.sort(function (a, b) { return String(a.createdAt) < String(b.createdAt) ? -1 : 1; });

    scriviCompiti_(fusi);
    if (body.regole) scriviRegole_(body.regole);

    return json_({
      ok: true,
      compiti: fusi.filter(function (c) { return !c.deleted; }),
      regole: leggiRegole_(),
      ts: new Date().toISOString()
    });
  } finally {
    lock.releaseLock();
  }
}
