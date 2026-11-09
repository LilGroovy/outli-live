// The activity's card as the link preview image (1200×630), in Outli's colours:
// when, who wants to do what, where, and Outli. Ended or unknown → the generic image.
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const PREVIEW_URL = 'https://europe-west1-groupitv2.cloudfunctions.net/activityPreview';
const LABELS = { tonight: 'Tonight', tomorrow: 'Tomorrow', weekend: 'This weekend', flexible: 'Any time' };

// A tiny element helper so this stays plain JavaScript (no JSX build step).
const el = (type, style, ...children) => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.filter((child) => child != null && child !== '') },
});

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';
  const preview = await fetch(`${PREVIEW_URL}?id=${encodeURIComponent(id)}`)
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  if (!preview || preview.ended) return Response.redirect(new URL('/Assets/og-share.png', url), 302);

  const when = preview.plan ? 'Plan set' : LABELS[preview.when] || 'Soon';
  const where = preview.plan ? preview.plan.venueName : preview.placeName || preview.areaName;

  const card = el('div', { width: '100%', height: '100%', padding: 40, background: '#fcfbf9' },
    el('div', { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: 64, borderRadius: 48, background: '#fff1c9' },
      el('div', { alignSelf: 'flex-start', padding: '10px 28px', borderRadius: 999, background: '#ffffff', color: '#292722', fontSize: 34 }, when),
      el('div', { flexDirection: 'column' },
        el('div', { color: '#77736b', fontSize: 38 }, `${preview.ownerName} wants to`),
        el('div', { color: '#292722', fontSize: 80, lineHeight: 1.1, marginTop: 8 }, preview.text),
        where ? el('div', { color: '#77736b', fontSize: 38, marginTop: 12 }, where) : null),
      el('div', { alignItems: 'center', color: '#292722', fontSize: 32 },
        { type: 'img', props: { src: `${url.origin}/Assets/app-icon.png`, width: 48, height: 48, style: { borderRadius: 12, marginRight: 16 } } },
        preview.needsApproval ? 'Ask to join on Outli' : 'Join on Outli')));

  return new ImageResponse(card, { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=300' } });
}
