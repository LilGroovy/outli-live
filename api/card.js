// The activity's card as the link preview image (1200×630), laid out like the app's
// ActivityCard: when, what (largest), where, then who's in with the owner's face, and
// one action. Inter, because SF Pro may not be used in server-rendered images.
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
const CREAM = '#fcfbf9';
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

  const [regular, medium, ownerFace] = await Promise.all([font(400), font(500), photo(preview.ownerPhotoUrl)]);

  const when = preview.plan ? planTime(preview.plan) : LABELS[preview.when];
  const where = preview.plan ? preview.plan.venueName : preview.placeName || preview.areaName;
  // As the app's people line: "Just Lea so far", "Lea and 2 others".
  const others = preview.peopleCount - 1;
  const people = others <= 0 ? `Just ${preview.ownerName} so far`
    : `${preview.ownerName} and ${others === 1 ? '1 other' : `${others} others`}`;
  const face = ownerFace
    ? img(ownerFace, 60, { borderRadius: 30, objectFit: 'cover', border: '3px solid #ffffff', marginRight: 18 })
    : el('div', { width: 60, height: 60, borderRadius: 30, marginRight: 18, background: '#ffffff', alignItems: 'center',
      justifyContent: 'center', fontSize: 28, fontWeight: 500 }, preview.ownerName.slice(0, 1));

  // The app's ActivityCard, large: when, what, where, then who's in, on the activity's wash.
  const card = el('div', { width: '100%', height: '100%', padding: 28, background: CREAM, fontFamily: 'Inter', color: INK },
    el('div', { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '52px 60px', borderRadius: 52, background: WASH },
      el('div', { flexDirection: 'column' },
        el('div', { justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 },
          when ? el('div', { padding: '10px 26px', borderRadius: 999, background: '#ffffff', fontSize: 30, fontWeight: 500 }, when) : el('div', {}),
          img('https://outli.live/Assets/app-icon.png', 52, { borderRadius: 13 })),
        el('div', { fontSize: 84, fontWeight: 500, lineHeight: 1.14, letterSpacing: -1.5, maxHeight: 200, overflow: 'hidden', paddingBottom: 4 },
          preview.text.trim()),
        where ? el('div', { fontSize: 34, color: SECONDARY, marginTop: 10 }, where) : null),
      el('div', { justifyContent: 'space-between', alignItems: 'center' },
        el('div', { alignItems: 'center', fontSize: 32 }, face, people),
        el('div', { padding: '14px 32px', borderRadius: 999, background: AMBER, fontSize: 30, fontWeight: 500 },
          preview.needsApproval ? 'Ask to join on Outli' : 'Join on Outli'))));

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
