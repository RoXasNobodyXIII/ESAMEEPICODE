const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { connectToDB, getDB } = require('../services/db');
const { encrypt } = require('../services/crypto');

function needsEncrypt(v) {
  if (v == null || v === '') return false;
  if (typeof v !== 'string') return true;
  const parts = v.split(':');
  return parts.length !== 3 || !parts[0] || !parts[1] || !parts[2];
}

(async () => {
  try {
    if (!process.env.DATA_ENC_KEY) {
      throw new Error('DATA_ENC_KEY not set. Aborting migration.');
    }
    await connectToDB();
    const db = getDB();
    const col = db.collection('fogli_marcia');

    const cursor = col.find({}, { projection: { id: 1, indirizzo: 1, cognome: 1, nome: 1, note: 1, destinazione: 1 } });
    let updated = 0;
    let scanned = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      scanned += 1;
      const set = {};
      const fields = ['indirizzo','cognome','nome','note','destinazione'];
      for (const f of fields) {
        const val = doc[f];
        if (needsEncrypt(val)) {
          if (val != null && String(val).trim() !== '') set[f] = encrypt(String(val));
        }
      }
      if (Object.keys(set).length) {
        await col.updateOne({ _id: doc._id }, { $set: set });
        updated += 1;
      }
    }
    console.log(`Migration completed. Scanned: ${scanned}, Updated: ${updated}`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err?.message || err);
    process.exit(1);
  }
})();
