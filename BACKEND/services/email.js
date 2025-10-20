const nodemailer = require('nodemailer');

const DEFAULT_FROM = process.env.EMAIL_FROM || 'no-reply@example.com';
const DEFAULT_REPLY_TO = process.env.EMAIL_REPLY_TO || undefined;

// Gmail SMTP
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; 
const GMAIL_ENABLED = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

let gmailTransport = null;
if (GMAIL_ENABLED) {
  gmailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

// Generic SMTP
const SMTP_HOST = process.env.EMAIL_HOST;
const SMTP_PORT = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
const SMTP_USER = process.env.EMAIL_USER;
const SMTP_PASS = process.env.EMAIL_PASSWORD;
const SMTP_SECURE = String(process.env.EMAIL_SECURE || '').toLowerCase() === 'true'; // optional
const SMTP_ENABLED = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
const SMTP_URL = process.env.EMAIL_URL;
const SMTP_POOL = String(process.env.EMAIL_POOL || '').toLowerCase() === 'true';
const SMTP_IGNORE_TLS = String(process.env.EMAIL_IGNORE_TLS || '').toLowerCase() === 'true';
const SMTP_REQUIRE_TLS = String(process.env.EMAIL_REQUIRE_TLS || '').toLowerCase() === 'true';
const SMTP_DEBUG = String(process.env.EMAIL_SMTP_DEBUG || '').toLowerCase() === 'true';
const SMTP_LOGGER = String(process.env.EMAIL_SMTP_LOGGER || '').toLowerCase() === 'true';

let smtpTransport = null;
if (SMTP_URL) {
  smtpTransport = nodemailer.createTransport(SMTP_URL);
} else if (SMTP_ENABLED) {
  smtpTransport = nodemailer.createTransport({
    pool: SMTP_POOL || undefined,
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    ignoreTLS: SMTP_IGNORE_TLS || undefined,
    requireTLS: SMTP_REQUIRE_TLS || undefined,
    logger: SMTP_LOGGER || undefined,
    debug: SMTP_DEBUG || undefined,
  });
}

function ensureConfigured() {
  // Allow either Gmail SMTP or generic SMTP to be configured
  if (!GMAIL_ENABLED && !SMTP_ENABLED && !SMTP_URL) {
    const err = new Error('No email provider configured. Set Gmail (GMAIL_USER + GMAIL_APP_PASSWORD) or generic SMTP (EMAIL_HOST/PORT/USER/PASSWORD) in .env');
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }
}

/**
 * Send an email via Gmail
 * @param {Object} params
 * @param {string|string[]} params.to
 * @param {string} params.subject 
 * @param {string} [params.text] 
 * @param {string} [params.html] 
 * @param {string|Object} [params.from] 
 * @param {string|Object} [params.replyTo] - 
 * @param {string|string[]} [params.cc]
 * @param {string|string[]} [params.bcc]
 * @param {Array} [params.attachments] - 
 * @param {string[]} [params.categories]
 * @param {Object} [params.customArgs]
 * @param {Object} [params.headers]
 */
async function sendMail({
  to,
  subject,
  text,
  html,
  from,
  replyTo,
  cc,
  bcc,
  attachments,
  categories,
  customArgs,
  headers,
}) {
  ensureConfigured();
  if (!to) throw new Error('Missing recipient: to');
  if (!subject) throw new Error('Missing subject');

  const normalizeList = (val) => (Array.isArray(val) ? val : val ? [val] : undefined);

  if (GMAIL_ENABLED) {
    try {
      const mailOptions = {
        from: GMAIL_USER,
        to: normalizeList(to),
        subject,
        text: text || undefined,
        html: html || undefined,
        cc: normalizeList(cc),
        bcc: normalizeList(bcc),
        replyTo: replyTo || DEFAULT_REPLY_TO || undefined,
        attachments: Array.isArray(attachments) ? attachments : undefined,
        headers: headers || undefined,
      };
      const info = await gmailTransport.sendMail(mailOptions);
      return {
        status: 250,
        messageId: info?.messageId,
        response: info?.response,
        provider: 'gmail',
      };
    } catch (err) {
      const error = new Error(`Gmail SMTP send failed: ${err?.message || 'unknown error'}`);
      error.details = { provider: 'gmail', code: err?.code, response: err?.response };
      throw error;
    }
  }

  
  if (SMTP_ENABLED || SMTP_URL) {
    try {
      const smtpFrom = DEFAULT_FROM;
      if (from && from !== smtpFrom) {
        console.warn('[sendMail] Ignoring custom from for SMTP', { providedFrom: from, usingFrom: smtpFrom });
      }
      const mailOptions = {
        from: smtpFrom,
        to: normalizeList(to),
        subject,
        text: text || undefined,
        html: html || undefined,
        cc: normalizeList(cc),
        bcc: normalizeList(bcc),
        replyTo: replyTo || DEFAULT_REPLY_TO || undefined,
        attachments: Array.isArray(attachments) ? attachments : undefined,
        headers: headers || undefined,
      };
      const info = await smtpTransport.sendMail(mailOptions);
      return {
        status: 250,
        messageId: info?.messageId,
        response: info?.response,
        provider: 'smtp',
      };
    } catch (err) {
      const error = new Error(`SMTP send failed: ${err?.message || 'unknown error'}`);
      error.details = { provider: 'smtp', code: err?.code, response: err?.response };
      throw error;
    }
  }

}

async function verifyMailTransport() {
  ensureConfigured();
  const t = gmailTransport || smtpTransport;
  return t.verify();
}

module.exports = { sendMail, verifyMailTransport };
