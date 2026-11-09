// The activity's card as the link preview image (1200×630): who (a big portrait, as
// the app shows people), when, what, where and who's in, and one action that carries
// the Outli mark. Inter, because SF Pro may not be used in server-rendered images.
// Ended or unknown → the generic image.
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const PREVIEW_URL = 'https://europe-west1-groupitv2.cloudfunctions.net/activityPreview';
const FONT_URL = (weight) => `https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-${weight}-normal.woff`;
const LABELS = { tonight: 'Tonight', tomorrow: 'Tomorrow', weekend: 'This weekend', flexible: 'Any time' };

// Outli's colours (DesignToken.Color in the app). Until the app stores each activity's
// hue, every card uses the warm amber wash.
const INK = '#292722';
const SECONDARY = '#6f6b63';
const WASH = '#fff1c9';
const AMBER = '#ffb600';

// A tiny element helper so this stays plain JavaScript (no JSX build step).
const el = (type, style, ...children) => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.filter((child) => child != null && child !== '') },
});
const img = (src, size, style = {}) => ({ type: 'img', props: { src, width: size, height: size, style: { width: size, height: size, ...style } } });

const font = (weight) => fetch(FONT_URL(weight)).then((response) => response.arrayBuffer());

// Storage serves photos without an image type; pass them on as data URLs the renderer accepts.
async function photo(url) {
  if (!url) return null;
  try {
    const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
    const type = bytes[0] === 0x89 ? 'image/png' : 'image/jpeg';
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `data:${type};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

// "Fri, 20:00" in the plan's own time zone, as MeetupPlan.summary does.
function planTime(plan) {
  const startsAt = new Date(plan.startsAt);
  const zone = plan.timeZone || undefined;
  const day = startsAt.toLocaleDateString('en-GB', { weekday: 'short', timeZone: zone });
  const time = startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: zone });
  return `${day}, ${time}`;
}

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';
  const preview = await fetch(`${PREVIEW_URL}?id=${encodeURIComponent(id)}`)
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  if (!preview || preview.ended) return Response.redirect(new URL('/Assets/og-share.png', url), 302);

  const [regular, medium, face] = await Promise.all([font(400), font(500), photo(preview.ownerPhotoUrl)]);

  const when = preview.plan ? planTime(preview.plan) : LABELS[preview.when];
  const where = preview.plan ? preview.plan.venueName : preview.placeName || preview.areaName;
  const details = [where, preview.peopleCount > 1 ? `${preview.peopleCount} people in` : null].filter(Boolean).join(' · ');

  // The owner as the app shows people: a 4:5 portrait with an amber ring and their name.
  const portrait = el('div', { width: 360, height: 450, borderRadius: 40, border: `6px solid ${AMBER}`, overflow: 'hidden',
    position: 'relative', background: '#ffffff', alignItems: 'center', justifyContent: 'center' },
    face
      ? { type: 'img', props: { src: face, width: 348, height: 438, style: { width: 348, height: 438, objectFit: 'cover' } } }
      : el('div', { fontSize: 160, fontWeight: 500, color: INK }, preview.ownerName.slice(0, 1)),
    el('div', { position: 'absolute', left: 18, bottom: 18, padding: '8px 20px', borderRadius: 999, background: '#ffffff',
      fontSize: 28, fontWeight: 500, color: INK }, preview.ownerName));

  const card = el('div', { width: '100%', height: '100%', alignItems: 'center', padding: '56px 64px', background: WASH,
    fontFamily: 'Inter', color: INK },
    el('div', { flex: 1, height: '100%', flexDirection: 'column', justifyContent: 'space-between', marginRight: 56 },
      when ? el('div', { alignSelf: 'flex-start', padding: '10px 26px', borderRadius: 999, background: '#ffffff', fontSize: 30, fontWeight: 500 }, when) : el('div', {}),
      el('div', { flexDirection: 'column' },
        el('div', { fontSize: 34, color: SECONDARY, marginBottom: 10 }, `${preview.ownerName} wants to`),
        el('div', { fontSize: 68, fontWeight: 500, lineHeight: 1.16, letterSpacing: -1.2, maxHeight: 240, overflow: 'hidden', paddingBottom: 4 },
          preview.text.trim()),
        details ? el('div', { fontSize: 30, color: SECONDARY, marginTop: 16 }, details) : null),
      el('div', { alignSelf: 'flex-start', alignItems: 'center', padding: '12px 30px 12px 14px', borderRadius: 999, background: AMBER,
        fontSize: 30, fontWeight: 500 },
        img('https://outli.live/Assets/app-icon.png', 40, { borderRadius: 10, marginRight: 14 }),
        preview.needsApproval ? 'Ask to join on Outli' : 'Join on Outli')),
    portrait);

  return new ImageResponse(card, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      { name: 'Inter', data: medium, weight: 500, style: 'normal' },
    ],
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
