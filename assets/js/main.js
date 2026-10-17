/* Legacive Barber Studio · shared site script
 * Every block checks for its own elements first, so the same file runs on all pages.
 */
(() => {
  const d = document, root = d.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const L = window.LEGACIVE;
  const PHONE = L.phone, BOOKSY = L.booksy, MAPS = L.maps;
  const img = k => 'assets/img/' + k + '.webp';
  const sms = t => 'sms:' + PHONE + '?&body=' + encodeURIComponent(t);
  const escH = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const scrollToEl = (t, off = -20) => { if (!t) return; window.__lenis ? window.__lenis.scrollTo(t, { offset: off, duration: 1.3 }) : t.scrollIntoView({ behavior: 'smooth' }); };
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- active nav ---------- */
  const page = d.body.dataset.page;
  $$('[data-nav]').forEach(a => { if (a.dataset.nav === page) a.setAttribute('aria-current', 'page'); });

  /* ---------- hero video: widescreen triptych on desktop, portrait reel on phones ---------- */
  const hv = $('.hero__video');
  if (hv && hv.dataset.wide) {
    hv.src = matchMedia('(max-width: 900px)').matches ? hv.dataset.tall : hv.dataset.wide;
    hv.addEventListener('playing', () => { const p = $('.hero__poster'); if (p) p.style.opacity = 0; });
    // never let the hero sit paused: resume after tab switches or stalls
    d.addEventListener('visibilitychange', () => { if (!d.hidden && !RM) hv.play().catch(() => {}); });
    hv.addEventListener('stalled', () => { if (!RM) hv.play().catch(() => {}); });
  }

  /* ---------- videos: play only while on screen ---------- */
  $$('video[data-auto]').forEach(v => {
    v.muted = true; v.playsInline = true;
    v.addEventListener('playing', () => { v.style.opacity = 1; }, { once: true });
    if (RM) return;
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .15 }).observe(v);
  });

  /* ---------- split headings into letters ---------- */
  $$('.split').forEach(el => {
    const t = el.textContent; el.textContent = '';
    [...t].forEach(c => { const s = d.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? ' ' : c; s.setAttribute('aria-hidden', 'true'); el.appendChild(s); });
  });

  /* ---------- hexagon light clusters (their ceiling) ---------- */
  function buildHex(svg) {
    const NS = 'http://www.w3.org/2000/svg', big = svg.classList.contains('hex-big');
    const r = big ? 52 : 46, g = d.createElementNS(NS, 'g'); svg.appendChild(g);
    const cells = [[0, 0], [1.5, -0.866], [1.5, 0.866], [0, 1.732], [-1.5, 0.866], [-1.5, -0.866], [0, -1.732]].slice(0, big ? 7 : 5);
    const paths = cells.map(([cx, cy]) => {
      let s = ''; for (let i = 0; i <= 6; i++) { const a = Math.PI / 3 * i; s += (i ? ' L' : 'M') + ((cx + Math.cos(a)) * r).toFixed(1) + ' ' + ((cy + Math.sin(a)) * r).toFixed(1); }
      const p = d.createElementNS(NS, 'path'); p.setAttribute('d', s); g.appendChild(p); return p;
    });
    paths.forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = RM ? 0 : len; });
    return { g, paths, el: svg };
  }
  const hexes = $$('.hex-svg').map(buildHex);
  const heroHex = hexes.find(h => h.el.classList.contains('hero__hex'));
  const bigHex = hexes.find(h => h.el.classList.contains('hex-big'));

  /* ---------- marquee ---------- */
  const words = ['Fresh cut', 'Fresh confidence', 'Feel the difference', 'Skin fades', 'Designs', 'Beard work', 'Appointments only', 'Uxbridge, Ontario'];
  const scis = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>';
  $$('.marquee__row').forEach(row => { const chunk = words.map(w => `<span class="marquee__item">${w}${scis}</span>`).join(''); row.innerHTML = `<div style="display:flex">${chunk}</div><div style="display:flex" aria-hidden="true">${chunk}</div>`; });

  /* ---------- letters that rise toward the cursor (footer wordmark + headings) ---------- */
  $$('.foot__big').forEach(el => {
    const t = el.textContent.trim(); el.textContent = '';
    [...t].forEach((c, i) => { const s = d.createElement('span'); s.className = 'lt'; s.style.setProperty('--i', i); s.textContent = c; el.appendChild(s); });
    if (!FINE || RM) return;
    const lts = $$('.lt', el);
    el.addEventListener('pointermove', e => lts.forEach(s => { const r = s.getBoundingClientRect(), cx = r.left + r.width / 2, dist = Math.abs(e.clientX - cx), reach = r.width * 2.2; s.style.setProperty('--lift', Math.max(0, 1 - dist / reach).toFixed(3)); }));
    el.addEventListener('pointerleave', () => lts.forEach(s => s.style.setProperty('--lift', 0)));
  });

  /* ---------- menu ---------- */
  const burger = $('.nav__burger');
  const setMenu = open => { if (open) setBot(false); root.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  d.addEventListener('pointerdown', e => { if (root.classList.contains('menu-open') && !e.target.closest('#menu,.nav__burger')) setMenu(false); });

  /* ---------- hero (home) ---------- */
  const hero = $('.hero');
  const playBtn = $('#playBtn');
  if (hero && playBtn) {
    const v = $('.hero__reel video');
    playBtn.addEventListener('click', () => {
      if (v.paused) { v.play(); $('#playIco').setAttribute('d', 'M7 5h4v14H7zM13 5h4v14h-4z'); playBtn.setAttribute('aria-label', 'Pause video'); }
      else { v.pause(); $('#playIco').setAttribute('d', 'M8 5v14l11-7z'); playBtn.setAttribute('aria-label', 'Play video'); }
    });
    if (RM) $('#playIco').setAttribute('d', 'M8 5v14l11-7z');
    if (FINE) hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--mx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  }

  /* ---------- services menu board ---------- */
  const SVC = L.services;
  const svcList = $('#svcList'), svcView = $('#svcView');
  if (svcList && svcView) {
    SVC.forEach((s, i) => {
      const li = d.createElement('li'); li.className = 'svc__row rv' + (i === 0 ? ' is-on' : ''); li.tabIndex = 0; li.setAttribute('role', 'link'); li.dataset.i = i;
      li.setAttribute('aria-label', s.n + ', ' + (s.plus ? 'add ' : '') + '$' + s.p + ', ' + s.t + '. Book this');
      li.innerHTML = `<h3>${s.n}</h3><span class="svc__price">${s.plus ? '+' : ''}$${s.p}<small>${s.t}</small></span><p>${s.d}</p>`;
      svcList.appendChild(li);
      const im = d.createElement('img'); im.src = img(s.img); im.alt = s.n + ' at Legacive'; im.loading = 'lazy'; if (i === 0) im.className = 'is-on'; svcView.prepend(im);
    });
    const svcImgs = $$('img', svcView).reverse();
    const show = i => { $$('.svc__row').forEach((r, k) => r.classList.toggle('is-on', k === i)); svcImgs.forEach((im, k) => im.classList.toggle('is-on', k === i)); $('#svcCap').textContent = SVC[i].n; $('#svcDur').textContent = SVC[i].t; };
    $$('.svc__row').forEach(r => {
      const i = +r.dataset.i, go = () => { location.href = 'book.html?s=' + SVC[i].id; };
      r.addEventListener('pointerenter', () => { if (FINE) show(i); });
      r.addEventListener('focus', () => show(i));
      r.addEventListener('click', () => { if (!FINE && !r.classList.contains('is-on')) { show(i); return; } go(); });
      r.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }

  /* ---------- full price cards (services page) ---------- */
  const pgrid = $('#pgrid');
  if (pgrid) pgrid.innerHTML = SVC.map(s => `<article class="pcard rv"><img src="${img(s.img)}" alt="${escH(s.n)} at Legacive" loading="lazy"><div><div class="pcard__top"><h3>${s.n}</h3><b>${s.plus ? '+' : ''}$${s.p}</b></div><p>${s.d}</p><div class="acts"><span class="mono">${s.t}</span><a class="btn btn--ghost" href="book.html?s=${s.id}">Book this</a></div></div></article>`).join('');

  /* ---------- lightbox (shared) ---------- */
  const lb = $('#lb'), lbImg = $('#lbImg');
  let gList = [], gi = 0, lastFocus = null;
  function lbShow(i) { gi = (i + gList.length) % gList.length; const g = gList[gi]; lbImg.src = g.src; lbImg.alt = g.cap; $('#lbCap').textContent = g.cap; $('#lbNum').textContent = (gi + 1) + ' / ' + gList.length; }
  function lbOpen(list, i) { lastFocus = d.activeElement; gList = list; lb.hidden = false; root.style.overflow = 'hidden'; if (window.__lenis) window.__lenis.stop(); lbShow(i); $('.lb__close').focus(); }
  function lbClose() { lb.hidden = true; root.style.overflow = ''; if (window.__lenis) window.__lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  if (lb) {
    $('.lb__close').addEventListener('click', lbClose);
    $('.lb__prev').addEventListener('click', () => lbShow(gi - 1));
    $('.lb__next').addEventListener('click', () => lbShow(gi + 1));
    lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
    let tx = null;
    lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) lbShow(gi + (dx < 0 ? 1 : -1)); tx = null; });
  }
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (lb && !lb.hidden) lbClose(); setMenu(false); setBot(false); return; }
    if (!lb || lb.hidden) return;
    if (e.key === 'ArrowRight') lbShow(gi + 1); else if (e.key === 'ArrowLeft') lbShow(gi - 1);
    else if (e.key === 'Tab') { const f = $$('.lb__btn'); const k = f.indexOf(d.activeElement); e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
  const CUTS = L.cuts.map(c => ({ src: img(c.k), cap: c.cap, tags: c.tags }));

  /* ---------- 3D ring gallery (from Vision Properties) ---------- */
  const ring = $('#ring'), stg = $('#ringStage');
  if (ring && stg) {
    const R = CUTS, n = R.length, step = 360 / n;
    ring.innerHTML = R.map((r, i) => `<button class="ri" style="--a:${i * step}deg" data-k="${i}" aria-label="Open photo: ${escH(r.cap)}"><img src="${r.src}" alt="" loading="lazy" draggable="false"></button>`).join('');
    const items = $$('.ri', ring);
    const size = () => { const w = Math.min(230, Math.max(128, stg.clientWidth * .17)); const Rr = Math.round(w * 1.02 / (2 * Math.tan(Math.PI / n))); ring.style.setProperty('--w', w + 'px'); ring.style.setProperty('--R', Rr + 'px'); stg.style.setProperty('--R', Rr + 'px'); };
    size(); addEventListener('resize', size);
    let rot = 0, vel = 0, drag = false, x0 = 0, r0 = 0, moved = 0, front = -1, vis = false;
    const draw = () => {
      ring.style.setProperty('--rot', rot + 'deg');
      let best = 0, bd = 999;
      items.forEach((it, i) => { const dd = ((i * step + rot) % 360 + 540) % 360 - 180, ad = Math.abs(dd); if (ad < bd) { bd = ad; best = i; } it.style.opacity = ad > 100 ? .22 : 1 - ad / 260; });
      if (best !== front) { if (items[front]) items[front].classList.remove('is-front'); front = best; items[front].classList.add('is-front'); $('#rName').textContent = R[best].cap; $('#rArea').textContent = (best + 1) + ' / ' + n + ' · Legacive'; }
    };
    const loop = () => { if (vis) { if (!drag) { if (Math.abs(vel) > .01) { rot += vel; vel *= .94; } else if (!RM) rot -= .07; } draw(); } requestAnimationFrame(loop); };
    new IntersectionObserver(es => es.forEach(e => vis = e.isIntersecting), { threshold: .05 }).observe(stg);
    stg.addEventListener('pointerdown', e => { drag = true; moved = 0; x0 = e.clientX; r0 = rot; vel = 0; stg.classList.add('drag'); stg.setPointerCapture(e.pointerId); });
    stg.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - x0; if (Math.abs(dx) > 5) moved = 1; const nr = r0 + dx * .25; vel = nr - rot; rot = nr; });
    stg.addEventListener('pointercancel', () => { drag = false; stg.classList.remove('drag'); });
    stg.addEventListener('pointerup', e => { drag = false; stg.classList.remove('drag'); if (!moved) { const it = d.elementsFromPoint(e.clientX, e.clientY).find(el => el.classList && el.classList.contains('ri')); if (it) lbOpen(R, +it.dataset.k); } });
    const snap = k => { const target = -((front + k) * step); const diff = ((target - rot) % 360 + 540) % 360 - 180; vel = diff * .08; };
    $('#rPrev').onclick = () => snap(-1); $('#rNext').onclick = () => snap(1);
    const all = $('#rAll'); if (all) all.onclick = () => lbOpen(R, front < 0 ? 0 : front);
    ring.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('ri')) { e.preventDefault(); lbOpen(R, +e.target.dataset.k); } });
    draw(); loop();
  }

  /* ---------- filterable gallery grid (gallery page) ---------- */
  const ggrid = $('#ggrid'), gfil = $('#gfilters');
  if (ggrid && gfil) {
    ggrid.innerHTML = CUTS.map((c, i) => `<button class="gitem" data-i="${i}" data-tags="${c.tags.join(' ')}" aria-label="Open photo: ${escH(c.cap)}"><img src="${c.src}" alt="${escH(c.cap)}" loading="lazy" width="720" height="900"><span>${escH(c.cap)}</span></button>`).join('');
    const FIL = [['all', 'All cuts'], ['fade', 'Fades'], ['curly', 'Curly & textured'], ['design', 'Designs'], ['beard', 'Beard work']];
    gfil.innerHTML = FIL.map(([k, l], i) => `<button class="pick" type="button" data-f="${k}" aria-pressed="${i === 0}">${l} <small>${k === 'all' ? CUTS.length : CUTS.filter(c => c.tags.includes(k)).length}</small></button>`).join('');
    let shown = CUTS.map((c, i) => i);
    gfil.addEventListener('click', e => {
      const b = e.target.closest('.pick'); if (!b) return; const f = b.dataset.f;
      $$('.pick', gfil).forEach(x => x.setAttribute('aria-pressed', x === b));
      shown = [];
      $$('.gitem', ggrid).forEach(it => { const on = f === 'all' || it.dataset.tags.split(' ').includes(f); it.classList.toggle('is-out', !on); if (on) shown.push(+it.dataset.i); });
      if (window.gsap && !RM) gsap.fromTo($$('.gitem:not(.is-out)', ggrid), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out', stagger: .03 });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
    ggrid.addEventListener('click', e => { const it = e.target.closest('.gitem'); if (!it) return; const list = shown.map(i => CUTS[i]); lbOpen(list, shown.indexOf(+it.dataset.i)); });
  }

  /* ---------- booking form ---------- */
  const form = $('#bookForm');
  if (form) {
    const fSvc = $('#fSvc'), fDays = $('#fDays'), fTime = $('#fTime'), fDate = $('#fDate');
    const st = { svc: null, day: null, time: null };
    const pad = x => String(x).padStart(2, '0');
    const iso = dt => dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
    const nice = s => { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }); };
    const fmt12 = t => { let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + pad(m) + ' ' + ap; };
    const today = new Date(); fDate.min = iso(today);
    const radio = (group, val) => $$('.pick', group).forEach(b => b.setAttribute('aria-checked', b.dataset.v === val));
    const mk = (group, v, html, fn) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'pick'; b.dataset.v = v; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false'); b.innerHTML = html; b.onclick = fn; group.appendChild(b); };
    SVC.forEach(s => mk(fSvc, s.id, `${s.n} <small>${s.plus ? '+' : ''}$${s.p}</small>`, () => pickSvc(s.id)));
    for (let i = 0; i < 6; i++) { const dt = new Date(today); dt.setDate(today.getDate() + i); const v = iso(dt); mk(fDays, v, i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dt.toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric' }), () => pickDay(v)); }
    L.slots.forEach(t => mk(fTime, t, fmt12(t), () => { st.time = t; radio(fTime, t); $('#eTime').textContent = ''; ticket(); }));
    function pickSvc(id) { st.svc = id; radio(fSvc, id); $('#eSvc').textContent = ''; ticket(); }
    function pickDay(v) {
      st.day = v; radio(fDays, v); fDate.value = v; $('#eDay').textContent = '';
      const isToday = v === iso(new Date()), nowH = new Date().getHours();
      $$('.pick', fTime).forEach(b => { const past = isToday && parseInt(b.dataset.v) <= nowH; b.disabled = past; if (past && st.time === b.dataset.v) { st.time = null; b.setAttribute('aria-checked', 'false'); } });
      ticket();
    }
    fDate.addEventListener('change', () => { if (fDate.value) pickDay(fDate.value); });
    const nm = $('#fName'), ph = $('#fPhone'), em = $('#fEmail'), note = $('#fNote');
    nm.addEventListener('input', () => { $('#eName').textContent = ''; nm.removeAttribute('aria-invalid'); ticket(); });
    ph.addEventListener('input', () => { $('#ePhone').textContent = ''; ph.removeAttribute('aria-invalid'); });
    em.addEventListener('input', () => { $('#eEmail').textContent = ''; em.removeAttribute('aria-invalid'); });
    function ticket() {
      const s = SVC.find(x => x.id === st.svc);
      const set = (id, val, empty) => { const el = $(id); el.textContent = val || empty; el.classList.toggle('is-empty', !val); };
      set('#tSvc', s ? s.n : '', 'Pick a service');
      set('#tWhen', st.day ? nice(st.day) + (st.time ? ' · ' + fmt12(st.time) : '') : '', 'Pick a day and time');
      set('#tName', nm.value.trim(), 'Your name');
      $('#tPrice').textContent = s ? (s.plus ? '+' : '') + '$' + s.p : '$—';
    }
    const pre = new URLSearchParams(location.search).get('s'); if (pre && SVC.some(s => s.id === pre)) pickSvc(pre);
    const bookMsg = () => { const s = SVC.find(x => x.id === st.svc); return `Hi AK, I'd like to book a ${s ? s.n.toLowerCase() : 'cut'} on ${nice(st.day)} at ${fmt12(st.time)}. Name: ${nm.value.trim()}. Phone: ${ph.value.trim()}.${note.value.trim() ? ' Note: ' + note.value.trim() : ''}`; };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      let bad = null; const fail = (el, errId, txt) => { $(errId).textContent = txt; if (el) el.setAttribute('aria-invalid', 'true'); bad = bad || el; };
      if (!st.svc) fail(null, '#eSvc', 'Pick a service, like "Skin fade".');
      if (!st.day) fail(null, '#eDay', 'Pick a day for your cut.');
      if (!st.time) fail(null, '#eTime', 'Pick a time. AK will confirm it.');
      if (nm.value.trim().length < 2) fail(nm, '#eName', 'Add your name so AK knows who’s coming.');
      const digits = ph.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) fail(ph, '#ePhone', 'Use a 10-digit number, like (905) 555-0123.');
      if (em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) fail(em, '#eEmail', 'Check the email, like you@example.com.');
      if (!st.svc || !st.day || !st.time) { scrollToEl(!st.svc ? fSvc : !st.day ? fDays : fTime, -120); if (!bad) return; }
      if (bad) { bad.focus(); return; }
      const btn = $('#bookBtn'); btn.dataset.state = 'loading'; btn.textContent = 'Sending';
      const row = { service: st.svc, day: st.day, time: st.time, name: nm.value.trim(), phone: ph.value.trim(), email: em.value.trim() || null, note: note.value.trim() || null, source: 'website' };
      let saved = false;
      if (L.supabaseUrl && L.supabaseKey) {
        try { const r = await fetch(L.supabaseUrl + '/rest/v1/bookings', { method: 'POST', headers: { apikey: L.supabaseKey, Authorization: 'Bearer ' + L.supabaseKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(row) }); saved = r.ok; } catch (err) { saved = false; }
      }
      btn.removeAttribute('data-state'); btn.textContent = 'Send booking request';
      const msgTxt = bookMsg(); $('#doneSms').href = sms(msgTxt);
      $('#doneTxt').textContent = saved
        ? `Your request for ${nice(st.day)} at ${fmt12(st.time)} is in. AK will text ${ph.value.trim()} to confirm.`
        : `One last tap: send it to AK by text so he can lock in ${nice(st.day)} at ${fmt12(st.time)}.`;
      $('#doneSms').textContent = saved ? 'Text the studio too' : 'Send by text';
      $('#book').classList.add('is-done');
      scrollToEl($('#book'), -90);
    });
    $('#bookAgain').addEventListener('click', () => { $('#book').classList.remove('is-done'); form.reset(); st.svc = st.day = st.time = null; [fSvc, fDays, fTime].forEach(g => radio(g, '')); ticket(); });
  }

  /* ---------- chatbot (rule-based, only the shop's real info) ---------- */
  const KB = [
    { k: /(hello|hi\b|hey|yo\b|sup|salam|good (morning|afternoon|evening))/, a: 'Hey! Welcome to Legacive. I can help with booking, prices, services and finding the studio. What do you need?' },
    { k: /(book|appointment|slot|available|availability|reserve|schedule|opening)/, a: 'Legacive is appointments only. Grab an open slot on Booksy any time, or send a request on the Book page and AK will text you to confirm.', btn: ['Book a cut', 'book.html'] },
    { k: /(walk ?in|walk-in|just show|drop in)/, a: 'No walk-ins, sorry. It’s appointments only, so the chair is ready for you at your time.', btn: ['See open slots', BOOKSY] },
    { k: /(price|cost|how much|\$|rate|charge|menu)/, a: 'Guide prices:\nSkin fade $45 · Haircut $40\nCut + beard $55 · Beard & line-up $25\nKids’ cut $30 · VIP $90 · Design +$10\nFinal price is confirmed when you book.', btn: ['Full menu', 'services.html'] },
    { k: /(fade|taper|skin|bald)/, a: 'Skin and bald fades are a speciality: blended up to any length on top, edged and lined. About 45 min, guide price $45.', btn: ['Book a fade', 'book.html?s=fade'] },
    { k: /(design|pattern|line in|part|freestyle)/, a: 'Hair designs, hard parts and neck designs can be added to any cut, usually +$10 and around 15 extra minutes.', btn: ['See designs', 'gallery.html'] },
    { k: /(beard|shape ?up|line ?up|edge ?up)/, a: 'Beard trims, shape-ups and line-ups are $25 on their own, or $55 together with a haircut.' },
    { k: /(kid|child|son|boy|young)/, a: 'Kids’ cuts (13 and under) are $30, around 40 minutes.' },
    { k: /(curl|curly|textur|crop|perm)/, a: 'Curly and textured cuts are a big part of the work. Check the gallery for crops, curly tops and tapers.', btn: ['Open the gallery', 'gallery.html'] },
    { k: /(where|location|address|direction|map|uxbridge|brock|parking|find)/, a: 'Legacive Barber Studio\n24 Brock Street West, Uxbridge, Ontario.', btn: ['Get directions', MAPS] },
    { k: /(hour|open|close|time|when|today|tomorrow|weekend|sunday|saturday)/, a: 'Hours run by appointment. The quickest way to see what’s open today or this week is Booksy.', btn: ['See open slots', BOOKSY] },
    { k: /(phone|call|text|number|contact|reach)/, a: 'Call or text the studio at (289) 988-5515.', btn: ['Call now', 'tel:' + PHONE] },
    { k: /(who|barber|ak\b|owner|dynasty)/, a: 'Legacive is AK’s studio. He sharpened his craft at Dynasty Barber Studio before opening his own appointment-only room in Uxbridge.', btn: ['Meet AK', 'about.html'] },
    { k: /(insta|tiktok|social|facebook|video|reel)/, a: 'New cuts go up on TikTok at @legacive.barbershop.', btn: ['Open TikTok', 'https://www.tiktok.com/@legacive.barbershop'] },
    { k: /(student|prom|discount|deal|promo)/, a: 'Student and prom deals run at certain times of year. Text the studio to ask what’s on right now.', btn: ['Text the studio', sms('Hi AK, are there any student or prom deals right now?')] },
    { k: /(vip|wash|full works|premium)/, a: 'VIP service is the full works: cut, beard, wash and detailing, about 90 minutes, guide price $90.' }
  ];
  const chips = ['Book a cut', 'Prices', 'Skin fade', 'Designs', 'Location', 'Walk-ins?', 'Call'];
  const fab = $('#botFab'), log = $('#botLog'), chipBox = $('#botChips'), bform = $('#botForm'), inp = $('#botIn'), berr = $('#botErr');
  let greeted = false;
  function say(text, who = 'bot', btn) {
    const m = d.createElement('div'); m.className = 'msg msg--' + who; m.textContent = text;
    if (btn) { const a = d.createElement('a'); a.className = 'msg__btn'; a.href = btn[1]; if (/^https?:/.test(btn[1])) { a.target = '_blank'; a.rel = 'noopener'; } a.textContent = btn[0]; m.appendChild(d.createElement('br')); m.appendChild(a); }
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function answer(q) {
    const t = q.toLowerCase(), hit = KB.find(e => e.k.test(t));
    const typing = d.createElement('div'); typing.className = 'msg msg--bot msg--typing'; typing.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(typing); log.scrollTop = log.scrollHeight;
    setTimeout(() => { typing.remove(); hit ? say(hit.a, 'bot', hit.btn) : say('I don’t have that one yet. AK can answer it by text.', 'bot', ['Text the studio', sms('Hi AK, ' + q)]); }, RM ? 0 : 600);
  }
  const ask = q => { say(q, 'me'); answer(q); };
  chips.forEach(c => { const b = d.createElement('button'); b.type = 'button'; b.textContent = c; b.addEventListener('click', () => ask(c)); chipBox.appendChild(b); });
  function setBot(open) {
    if (open) setMenu(false);
    root.classList.toggle('bot-open', open); fab.setAttribute('aria-expanded', open);
    if (open) { if (!greeted) { greeted = true; say('Hey! Welcome to Legacive Barber Studio. Ask me about booking, prices, services or how to find us.'); } setTimeout(() => inp.focus({ preventScroll: true }), 250); }
  }
  fab.addEventListener('click', () => setBot(!root.classList.contains('bot-open')));
  $('#botClose').addEventListener('click', () => { setBot(false); fab.focus(); });
  inp.addEventListener('input', () => { berr.textContent = ''; });
  bform.addEventListener('submit', e => { e.preventDefault(); const q = inp.value.trim(); if (!q) { berr.textContent = 'Type a question first, like "How much is a fade?"'; inp.focus(); return; } inp.value = ''; ask(q); });

  /* ---------- Uxbridge clock ---------- */
  const clock = $('#clock');
  if (clock) { const tick = () => { const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()); clock.textContent = p.find(x => x.type === 'hour').value + ':' + p.find(x => x.type === 'minute').value; }; tick(); setInterval(tick, 15000); }

  /* ---------- interactive background: faceted black wall lit by the cursor ---------- */
  const BG = { x: 0, y: 0, tx: 0, ty: 0, scroll: 0 };
  const startWall = () => wall();
  const loadThree = () => { const cv = $('#bg'); if (!cv || RM && !FINE) return; const sc = d.createElement('script'); sc.src = 'assets/vendor/three.min.js'; sc.async = true; sc.onload = startWall; d.head.appendChild(sc); };
  addEventListener('load', () => ('requestIdleCallback' in window) ? requestIdleCallback(loadThree, { timeout: 1200 }) : setTimeout(loadThree, 300));
  function wall() {
    const cv = $('#bg'); if (!window.THREE || !cv) { if (cv) cv.remove(); return; }
    let rnd; try { rnd = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' }); } catch (e) { cv.remove(); return; }
    rnd.setPixelRatio(Math.min(devicePixelRatio || 1, FINE ? 1.25 : 1)); rnd.setClearColor(0x09090a, 1);
    const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x09090a, 14, 34);
    const cam = new THREE.PerspectiveCamera(42, 1, .1, 100); cam.position.set(0, 0, 16);
    const W = 44, H = 30, SX = FINE ? 34 : 22, SY = FINE ? 24 : 16;
    let geo = new THREE.PlaneGeometry(W, H, SX, SY);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setXYZ(i, x + (Math.random() - .5) * (W / SX) * .55, y + (Math.random() - .5) * (H / SY) * .55, (Math.random() - .5) * .9 + Math.sin(x * .35) * .25); }
    geo = geo.toNonIndexed(); geo.computeVertexNormals();
    const wallM = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: .38, metalness: .72, flatShading: true })); wallM.rotation.x = -.08; scene.add(wallM);
    scene.add(new THREE.AmbientLight(0xffffff, .05));
    const key = new THREE.PointLight(0xfff4e0, 2.4, 22, 1.6); scene.add(key);
    const gold = new THREE.PointLight(0xc9a45c, 1.6, 26, 1.6); scene.add(gold);
    const cool = new THREE.PointLight(0x9fb4c8, .9, 26, 1.6); scene.add(cool);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xf4f4f6, transparent: true, opacity: .5 });
    const hexLoop = (cx, cy, r) => { const pts = []; for (let i = 0; i <= 6; i++) { const a = Math.PI / 3 * i; pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0)); } return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat); };
    const hexGrp = new THREE.Group(); [[0, 0], [1.5, -.866], [1.5, .866], [0, 1.732], [-1.5, .866]].forEach(([a, b]) => hexGrp.add(hexLoop(a * 1.6, b * 1.6, 1.6)));
    hexGrp.position.set(7.5, 4.2, 2.2); hexGrp.rotation.set(-.5, -.35, .1); scene.add(hexGrp);
    const hex2 = hexGrp.clone(); hex2.position.set(-9, -5, 1.2); hex2.rotation.set(.4, .4, -.2); hex2.scale.setScalar(.7); scene.add(hex2);
    const resize = () => { const w = innerWidth, h = innerHeight; rnd.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px'; cam.aspect = w / h; cam.updateProjectionMatrix(); };
    resize(); addEventListener('resize', resize);
    addEventListener('pointermove', e => { BG.tx = (e.clientX / innerWidth) * 2 - 1; BG.ty = -(e.clientY / innerHeight) * 2 + 1; }, { passive: true });
    const cover = $('.hero, .phero');
    let running = true, first = true; const t0 = performance.now();
    d.addEventListener('visibilitychange', () => { running = !d.hidden; if (running) requestAnimationFrame(frame); });
    const fb = $('.bg-fallback'); let fc = 0;
    function frame(now) {
      if (!running) return;
      if (!RM) requestAnimationFrame(frame);
      if (++fc % 2 && !first) return; // ~30fps is plenty for a slow light drift
      if (root.style.overflow === 'hidden') return;
      const t = (now - t0) / 1000;
      if (!FINE) { BG.tx = Math.sin(t * .35) * .6; BG.ty = Math.cos(t * .27) * .45; }
      BG.x += (BG.tx - BG.x) * .06; BG.y += (BG.ty - BG.y) * .06;
      key.position.set(BG.x * 11, BG.y * 7, 4.5);
      gold.position.set(-9 + Math.sin(t * .4) * 3, 5 + Math.cos(t * .3) * 2, 6);
      cool.position.set(9 + Math.cos(t * .33) * 3, -5 + Math.sin(t * .25) * 2, 6);
      wallM.rotation.y = BG.x * .06; wallM.rotation.x = -.08 + BG.y * .04 - BG.scroll * .12; wallM.position.y = BG.scroll * 2.2;
      hexGrp.rotation.z = t * .05; hexGrp.position.y = 4.2 + Math.sin(t * .6) * .3 + BG.scroll * 3;
      hex2.rotation.z = -t * .04; hex2.position.y = -5 + Math.cos(t * .5) * .3 + BG.scroll * 4;
      const covered = cover && cover.getBoundingClientRect().bottom > innerHeight * .98;
      if (first || !covered) { rnd.render(scene, cam); if (first) { first = false; cv.classList.add('is-on'); if (fb) fb.style.opacity = 0; } }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- page transitions: hexagon wipe between pages ---------- */
  const wHex = $('.wipe__hex'), wMark = $('.wipe__logo');
  const internal = a => a.host === location.host && /\.html$|\/$/.test(a.pathname) && !a.hash && a.target !== '_blank' && !a.hasAttribute('download');
  d.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (a.getAttribute('href').startsWith('#')) return;
    if (!internal(a) || a.pathname === location.pathname && a.search === location.search) return;
    if (!window.gsap || RM) return;
    e.preventDefault();
    try { sessionStorage.setItem('lg_wipe', '1'); } catch (err) {}
    gsap.timeline({ onComplete: () => { location.href = a.href; } })
      .to(wHex, { scale: 1, duration: .55, ease: 'expo.in' })
      .to(wMark, { opacity: 1, duration: .2 }, .35);
    setTimeout(() => { location.href = a.href; }, 1400);
  });
  addEventListener('pageshow', e => { if (e.persisted && window.gsap) { gsap.set(wHex, { scale: 0 }); gsap.set(wMark, { opacity: 0 }); root.classList.remove('is-entering'); } });

  /* ---------- no GSAP / reduced motion: show everything ---------- */
  const loader = $('.loader');
  if (!window.gsap || RM) {
    root.classList.remove('js', 'is-entering'); if (loader) loader.remove(); $$('.ld__meta').forEach(m => m.remove());
    hexes.forEach(h => h.paths.forEach(p => p.style.strokeDashoffset = 0));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const E = 'expo.out';

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true }); window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length < 2) return; const t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: id === '#top' ? 0 : -20, duration: 1.4 }); }));
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { BG.scroll = s.progress; } });

  /* entrance: intro loader (home, first visit) or hexagon wipe out */
  const heroChars = $$('.hero__title .ch, .phero h1 .ch');
  const heroBits = $$('.hero__eyebrow, .hero__sub, .hero__ctas, .hero__tools, .scroll-cue, .phero .crumbs, .phero__row');
  let seen = false; try { seen = sessionStorage.getItem('lg_intro') === '1'; } catch (err) {}
  gsap.set(heroChars, { yPercent: 115, rotate: 6 });
  gsap.set(heroBits, { opacity: 0, y: 24 });
  gsap.set('.hero__title .line, .phero h1 .line', { visibility: 'visible' });
  const revealHero = at => {
    const tl = gsap.timeline({ delay: at });
    tl.to(heroChars, { yPercent: 0, rotate: 0, duration: 1.1, ease: E, stagger: .025 }, 0)
      .to(heroBits, { opacity: 1, y: 0, duration: .9, ease: E, stagger: .06 }, .25);
    if (heroHex) tl.to(heroHex.paths, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.out', stagger: .12 }, .1);
    return tl;
  };
  const finish = () => { gsap.set('.hero__title .line, .phero h1 .line', { visibility: 'visible' }); gsap.set(heroChars, { yPercent: 0, rotate: 0 }); gsap.set(heroBits, { opacity: 1, y: 0 }); gsap.set(['.nav', '.bot-fab'], { autoAlpha: 1 }); if (heroHex) heroHex.paths.forEach(p => p.style.strokeDashoffset = 0); if (loader && loader.isConnected) loader.remove(); $$('.ld__meta').forEach(m => m.remove()); gsap.set(wHex, { scale: 0 }); root.classList.remove('is-entering'); gsap.ticker.lagSmoothing(400, 33); };
  setTimeout(finish, 4500);
  gsap.ticker.lagSmoothing(0);

  if (loader && !seen) {
    try { sessionStorage.setItem('lg_intro', '1'); } catch (err) {}
    root.classList.remove('is-entering');
    const cnt = { v: 0 }, lc = $('#lc'), kw = $('.knock__w'), ks = $('.knock__s'), metas = $$('.ld__meta');
    kw.innerHTML = [...kw.textContent].map(c => '<span' + (c === 'I' ? ' class="i"' : '') + '>' + c + '</span>').join('');
    const kL = $$('span', kw);
    gsap.set(kL, { yPercent: 115 }); gsap.set(ks, { opacity: 0, y: 10 }); gsap.set(['.nav', '.bot-fab'], { autoAlpha: 0 });
    const grade = $$('.hero__shade'), gradeOp = grade.map(el => parseFloat(getComputedStyle(el).opacity) || 1);
    gsap.set(grade, { opacity: 0 }); gsap.set('.hero__media', { scale: 1.3 });
    const fontsReady = Promise.race([(d.fonts && d.fonts.load) ? d.fonts.load('900 100px "Big Shoulders Display"') : Promise.resolve(), new Promise(r => setTimeout(r, 500))]);
    fontsReady.then(() => {
      gsap.timeline({ onComplete: () => gsap.ticker.lagSmoothing(400, 33) })
        .to('.hero__media', { scale: 1.06, duration: 1.4, ease: 'power2.inOut' }, 0)
        .to(cnt, { v: 100, duration: 1.05, ease: 'power2.inOut', onUpdate: () => { lc.textContent = String(Math.round(cnt.v)).padStart(3, '0'); } }, 0)
        .to(kL, { yPercent: 0, duration: .7, ease: E, stagger: .04 }, 0)
        .to(ks, { opacity: 1, y: 0, duration: .45, ease: E }, .25)
        .add(() => { const I = $('.i', kw).getBoundingClientRect(); gsap.set(loader, { transformOrigin: (I.left + I.width / 2) + 'px ' + (I.top + I.height * .55) + 'px' }); }, .95)
        .to([ks, metas], { opacity: 0, duration: .2, ease: 'power2.in' }, 1.0)
        .to(loader, { scale: 80, duration: .85, ease: 'expo.in' }, 1.0)
        .to('.hero__media', { scale: 1, duration: 1.2, ease: E }, 1.55)
        .set(loader, { autoAlpha: 0 }, 1.84)
        .to(grade, { opacity: i => gradeOp[i], duration: .9, ease: 'power2.out' }, 1.55)
        .to(['.nav', '.bot-fab'], { autoAlpha: 1, duration: .6, ease: 'power2.out' }, 1.6)
        .add(() => revealHero(0), 1.6)
        .add(() => { loader.remove(); metas.forEach(m => m.remove()); }, 1.9);
    });
  } else {
    if (loader) { loader.remove(); $$('.ld__meta').forEach(m => m.remove()); }
    const wiped = root.classList.contains('is-entering');
    gsap.timeline({ onComplete: () => { root.classList.remove('is-entering'); gsap.ticker.lagSmoothing(400, 33); } })
      .set(wHex, { scale: wiped ? 1 : 0 })
      .to(wHex, { scale: 0, duration: wiped ? .7 : 0, ease: 'expo.out' })
      .add(() => revealHero(0), wiped ? .15 : 0);
  }
  if (FINE) $$('.hero__title, .phero h1').forEach(h => {
    const chs = $$('.ch', h);
    h.addEventListener('pointermove', e => chs.forEach(c => { const r = c.getBoundingClientRect(), dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)), k = Math.max(0, 1 - dist / (r.height * 1.1)); gsap.to(c, { yPercent: -18 * k, duration: .45, ease: 'power3', overwrite: 'auto' }); c.classList.toggle('is-up', k > .35); }));
    h.addEventListener('pointerleave', () => chs.forEach(c => { gsap.to(c, { yPercent: 0, duration: .7, ease: 'elastic.out(1,.45)', overwrite: 'auto' }); c.classList.remove('is-up'); }));
  });
  if (heroHex) gsap.to(heroHex.g, { rotation: 360, svgOrigin: '0 0', duration: 160, ease: 'none', repeat: -1 });

  /* hero scroll: shrink into a framed reel */
  if (hero) gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__media', { scale: .84, yPercent: 8, borderRadius: 36, ease: 'none' }, 0)
    .to('.hero__inner', { yPercent: -18, opacity: .2, ease: 'none' }, 0);
  const ph = $('.phero');
  if (ph) gsap.timeline({ scrollTrigger: { trigger: ph, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.phero__media', { scale: 1.12, yPercent: 10, ease: 'none' }, 0)
    .to('.phero__inner', { yPercent: -14, opacity: .3, ease: 'none' }, 0);

  /* nav hide/show + progress */
  const nav = $('#nav');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { nav.classList.toggle('is-hidden', s.direction === 1 && s.scroll() > 300 && !root.classList.contains('menu-open')); gsap.set('.progress', { scaleX: s.progress }); } });

  /* marquee reacting to scroll speed */
  const mqs = $$('.marquee__row').map(r => gsap.fromTo(r, { xPercent: 0 }, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 }));
  if (mqs.length) {
    const speed = { v: 1 };
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { const v = Math.min(Math.abs(s.getVelocity()) / 220, 7); if (1 + v > speed.v) speed.v = 1 + v; } });
    gsap.ticker.add(() => { speed.v += (1 - speed.v) * .06; mqs.forEach(t => t.timeScale(speed.v)); });
  }

  /* mosaic: one full-screen photo pulls back into a 15-photo wall */
  const grid = $('.mosaic__grid'), center = $('.mosaic__grid .is-center');
  if (grid && center) {
    const startScale = () => Math.max(innerWidth / center.offsetWidth, innerHeight / center.offsetHeight) * 1.02;
    gsap.timeline({ scrollTrigger: { trigger: '.mosaic__pin', start: 'top top', end: '+=170%', pin: true, scrub: 1, invalidateOnRefresh: true } })
      .fromTo(grid, { scaleX: startScale, scaleY: startScale }, { scaleX: 1, scaleY: 1, ease: 'power1.inOut', duration: 1 }, 0)
      .fromTo($$('.mosaic__grid figure:not(.is-center)'), { opacity: 0 }, { opacity: 1, stagger: { each: .02, from: 'center', grid: 'auto' }, duration: .5 }, .15)
      .fromTo('.mosaic__title', { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .35 }, .75);
  }

  const mm = gsap.matchMedia();
  const cPhotos = $$('.ceil__photos img');
  mm.add('(min-width: 901px)', () => {
    if (bigHex && $('.ceil__pin')) gsap.timeline({ scrollTrigger: { trigger: '.ceil__pin', start: 'top top', end: '+=170%', pin: true, scrub: 1 } })
      .to(bigHex.paths, { strokeDashoffset: 0, stagger: .1, duration: .5, ease: 'none' })
      .to(cPhotos[1], { opacity: 1, duration: .3 }, .4)
      .to(cPhotos[2], { opacity: 1, duration: .3 }, .9)
      .to(bigHex.g, { rotation: 30, svgOrigin: '0 0', duration: 1.4, ease: 'none' }, 0)
      .from('.ceil__copy > *', { opacity: 0, y: 40, stagger: .08, duration: .3 }, 0);
    const track = $('.tour__track');
    if (track) { const dist = () => track.scrollWidth - innerWidth; gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.tour', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } }); }
  });
  mm.add('(max-width: 900px)', () => {
    if (bigHex && $('.ceil__art')) gsap.timeline({ scrollTrigger: { trigger: '.ceil__art', start: 'top 85%', end: 'bottom 30%', scrub: 1 } })
      .to(bigHex.paths, { strokeDashoffset: 0, stagger: .1, duration: .5, ease: 'none' })
      .to(cPhotos[1], { opacity: 1, duration: .3 }, .4).to(cPhotos[2], { opacity: 1, duration: .3 }, .9);
  });

  /* sticky stack */
  const slides = $$('.slide');
  slides.forEach((s, i) => { if (i < slides.length - 1) gsap.to(s, { scale: .9, filter: 'brightness(.35)', ease: 'none', scrollTrigger: { trigger: slides[i + 1], start: 'top bottom', end: 'top 15%', scrub: true } }); });
  slides.forEach(s => gsap.from($('h3', s), { yPercent: 40, opacity: 0, duration: 1.2, ease: E, scrollTrigger: { trigger: s, start: 'top 70%' } }));

  if ($('.story__pic img')) gsap.to('.story__pic img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
  if ($('.studio__reel')) gsap.from('.studio__reel', { rotate: -4, scale: .9, ease: 'none', scrollTrigger: { trigger: '.studio', start: 'top bottom', end: 'center center', scrub: true } });

  if (!FINE) {
    $$('.hexrow figure').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-live' }));
    const tt = $('.tour__track'); if (tt) { const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-live', e.isIntersecting)), { root: tt, threshold: .6 }); $$('.card').forEach(c => io.observe(c)); }
  }

  const rvIn = b => gsap.to(b, { opacity: 1, y: 0, duration: .9, ease: E, stagger: .06, overwrite: true, onComplete() { b.forEach(x => x.classList.add('is-in')); } });
  ScrollTrigger.batch('.rv', { start: 'top 94%', onEnter: rvIn, onEnterBack: rvIn });
  addEventListener('load', () => rvIn($$('.rv').filter(x => x.getBoundingClientRect().top < innerHeight)));

  if (FINE) {
    const cur = $('.cursor'), dot = $('.cursor-dot'), curTxt = $('span', cur);
    const cx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: .08 }), dy = gsap.quickTo(dot, 'y', { duration: .08 });
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); dx(e.clientX); dy(e.clientY); });
    d.addEventListener('pointerover', e => {
      const v = e.target.closest('[data-cursor="view"]'), g = e.target.closest('[data-cursor="drag"]'), l = e.target.closest('a,button:not(.ri),input,textarea,summary,[role="link"]');
      cur.classList.toggle('is-view', !!v && !l); cur.classList.toggle('is-drag', !!g && !l); cur.classList.toggle('is-link', !!l);
      curTxt.textContent = g ? 'DRAG' : 'VIEW';
    });
    $$('.mag').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4, ease: 'power3' }); });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
    });
    $$('.card, .tcard').forEach(c => {
      c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; gsap.to(c, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 900, duration: .5, ease: 'power3' }); });
      c.addEventListener('pointerleave', () => gsap.to(c, { rotateY: 0, rotateX: 0, duration: .8, ease: 'power3' }));
    });
  }
  addEventListener('load', () => ScrollTrigger.refresh());
})();
