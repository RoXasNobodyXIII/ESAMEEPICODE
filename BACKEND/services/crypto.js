const crypto = require('crypto');

function getKey() {
  const raw = process.env.DATA_ENC_KEY || '';
  const buf = Buffer.from(raw.replace(/^base64:/, '') || '', raw.startsWith('base64:') ? 'base64' : 'utf8');
  if (buf.length < 32) {
    const pad = Buffer.alloc(32 - buf.length);
    return Buffer.concat([buf, pad]).slice(0, 32);
  }
  return buf.slice(0, 32);
}

function encrypt(plaintext) {
  if (plaintext == null || plaintext === '') return plaintext;
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${enc.toString('base64')}:${tag.toString('base64')}`;
}

function decrypt(payload) {
  if (!payload || typeof payload !== 'string' || !payload.includes(':')) return payload;
  const key = getKey();
  const [ivB64, dataB64, tagB64] = payload.split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const data = Buffer.from(dataB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}

module.exports = { encrypt, decrypt };
