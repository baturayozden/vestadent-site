// Vercel serverless function — booking enquiry → email to the clinic via Resend.
// Dependency-free (uses global fetch on Node 18+). The patient receives NO automated
// medical reply; only the clinic inbox is notified. If RESEND_API_KEY is not set the
// endpoint returns 503 with a friendly fallback message so the form never looks broken.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const name = (body.name || '').toString().trim();
  const phone = (body.phone || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const treatment = (body.treatment || '').toString().trim();
  const message = (body.message || '').toString().trim();
  const consent = body.consent;
  const company = (body.company || '').toString().trim(); // honeypot

  // Honeypot: a bot filled the hidden field — pretend success, send nothing.
  if (company) return res.status(200).json({ ok: true });

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!name || !phone || !emailOk || consent !== 'yes') {
    return res.status(400).json({ ok: false, error: 'invalid', message: 'Please complete the required fields.' });
  }

  const KEY = process.env.RESEND_API_KEY;
  const TO = process.env.TO || 'info@vestadent.co.uk';
  // FROM must be on a domain verified in Resend. vestadent.co.uk is verified, so we
  // default to it (never the unverified onboarding@resend.dev sandbox sender).
  const FROM = process.env.FROM || 'Vestadent <noreply@vestadent.co.uk>';
  const FALLBACK = 'Please call us on 0203 302 9290 or email info@vestadent.co.uk.';

  if (!KEY) {
    return res.status(503).json({ ok: false, error: 'email_unavailable', message: FALLBACK });
  }

  const esc = (s) => String(s || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  const rows = [
    ['Name', name], ['Phone', phone], ['Email', email],
    ['Treatment', treatment || '—'], ['Message', message || '—'],
  ];
  const html = `<h2 style="font-family:Georgia,serif">New consultation enquiry</h2>`
    + `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">`
    + rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><strong>${esc(k)}</strong></td><td style="padding:4px 0">${esc(v)}</td></tr>`).join('')
    + `</table><p style="font-family:Arial,sans-serif;font-size:12px;color:#888">Sent from the vestadent.co.uk booking form.</p>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `New consultation enquiry — ${name}`,
        html,
        text,
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('Resend error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'send_failed', message: FALLBACK });
    }
    const sent = await r.json().catch(() => ({}));
    return res.status(200).json({ ok: true, id: sent.id || null });
  } catch (err) {
    console.error('contact handler error', err);
    return res.status(502).json({ ok: false, error: 'send_failed', message: FALLBACK });
  }
};
