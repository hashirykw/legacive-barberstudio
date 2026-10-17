/* Legacive Barber Studio · site data
 * Edit prices, services, time slots and contact details here; every page reads from this file.
 */
window.LEGACIVE = {
  phone: '+12899885515',
  phoneLabel: '(289) 988-5515',
  booksy: 'https://legacive.booksy.com/a',
  maps: 'https://www.google.com/maps/search/?api=1&query=24%20Brock%20Street%20West%2C%20Uxbridge%2C%20Ontario',

  /* Optional: paste your Supabase project URL + anon key to store booking requests (see README) */
  supabaseUrl: '',
  supabaseKey: '',

  /* Guide prices: confirm with the shop and update */
  services: [
    { id: 'fade',   n: 'Skin fade',       p: 45, t: '45 min',  img: 'c_skin',   d: 'Bald or skin fade, blended up to any length on top, edged and lined.' },
    { id: 'cut',    n: 'Haircut',         p: 40, t: '45 min',  img: 'c_crop',   d: 'Classic or modern cut with scissors and clippers: tapers, crops, flows and curls.' },
    { id: 'combo',  n: 'Cut + beard',     p: 55, t: '60 min',  img: 'c_silver', d: 'Any haircut plus a full beard shape-up, blended into the fade.' },
    { id: 'design', n: 'Hair design',     p: 10, t: '+15 min', img: 'c_design', d: 'Freehand lines, parts and neck designs added onto any cut.', plus: true },
    { id: 'beard',  n: 'Beard & line-up', p: 25, t: '30 min',  img: 'c_fade',   d: 'Beard trim, sharp cheek and neck lines, and a hairline line-up.' },
    { id: 'kids',   n: 'Kids’ cut',  p: 30, t: '40 min',  img: 'c_curls',  d: 'For 13 and under. Patient, quick and still sharp.' },
    { id: 'vip',    n: 'VIP service',     p: 90, t: '90 min',  img: 'c_ginger', d: 'The full works: cut, beard, wash and detailing with extra time in the chair.' }
  ],

  /* Request-form time slots (24h). Set to the shop's real hours. */
  slots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],

  /* Gallery photos: k = file in assets/img (without .webp) */
  cuts: [
    { k: 'c_skin',     cap: 'Side part + skin fade',    tags: ['fade'] },
    { k: 'c_crop',     cap: 'Curly textured crop',      tags: ['curly'] },
    { k: 'c_design',   cap: 'Drop fade + design',       tags: ['design', 'fade'] },
    { k: 'c_silver',   cap: 'Grey fade + full beard',   tags: ['fade', 'beard'] },
    { k: 'c_drop',     cap: 'Textured top, low taper',  tags: ['curly', 'fade'] },
    { k: 'c_neck',     cap: 'Neck design',              tags: ['design', 'curly'] },
    { k: 'c_curls',    cap: 'Curly top + fade',         tags: ['curly', 'fade'] },
    { k: 'c_ginger',   cap: 'Textured crop + beard',    tags: ['curly', 'beard'] },
    { k: 'c_textured', cap: 'Short textured cut',       tags: ['fade'] },
    { k: 'c_mullet',   cap: 'Modern mullet',            tags: ['curly'] },
    { k: 'c_curlback', cap: 'Curls, finished',          tags: ['curly', 'design'] },
    { k: 'c_studio',   cap: 'Curly top, studio light',  tags: ['curly'] },
    { k: 'c_flow',     cap: 'Longer flow + beard',      tags: ['beard'] },
    { k: 'c_fade',     cap: 'Mid fade + beard',         tags: ['fade', 'beard'] },
    { k: 'c_beard',    cap: 'Beard shape-up',           tags: ['beard'] },
    { k: 'c_buzz',     cap: 'Buzz + taper',             tags: ['fade'] }
  ]
};
