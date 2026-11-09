// outli.live/a/?id=… with the activity's own link preview. Apps that build their
// own preview (WhatsApp, Telegram, Discord, Slack) read these tags without running
// JavaScript, so the page is filled in here; the same page works statically too.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PREVIEW_URL = 'https://europe-west1-groupitv2.cloudfunctions.net/activityPreview';
const template = readFileSync(join(process.cwd(), 'a/index.html'), 'utf8');
const LABELS = { tonight: 'Tonight', tomorrow: 'Tomorrow', weekend: 'This weekend', flexible: 'Any time' };

const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function fetchPreview(id) {
  if (!id) return null;
  try {
    const response = await fetch(`${PREVIEW_URL}?id=${encodeURIComponent(id)}`);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function withTag(html, property, content) {
  return html.replace(new RegExp(`<meta property="${property}" content="[^"]*" />`), `<meta property="${property}" content="${escape(content)}" />`);
}

export default async function handler(req, res) {
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  const preview = await fetchPreview(id);
  let html = template;

  if (preview && !preview.ended) {
    const title = `${preview.ownerName} wants to ${preview.text}`;
    const where = preview.plan ? preview.plan.venueName : preview.placeName || preview.areaName;
    const description = [preview.plan ? 'Plan set' : LABELS[preview.when], where,
      preview.peopleCount > 1 ? `${preview.peopleCount} people in` : null,
      preview.needsApproval ? 'Ask to join on Outli' : 'Join on Outli'].filter(Boolean).join(' · ');
    html = withTag(html, 'og:title', title);
    html = withTag(html, 'og:description', description);
    html = withTag(html, 'og:image', `https://${req.headers.host}/api/card?id=${encodeURIComponent(id)}`);
    html = html.replace('<title>Join on Outli</title>', `<title>${escape(title)} · Outli</title>`);
  }
  html = html.replace('</head>', `  <script>window.__PREVIEW__ = ${JSON.stringify(preview).replace(/</g, '\\u003c')};</script>\n</head>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=600');
  res.status(200).send(html);
}
