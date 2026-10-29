(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  root.classList.add('js');
  const REPO = 'Talkdedsec/scoop-tlk';

  /* ---------- language ---------- */
  const TR = {
    'skip': 'İçeriğe geç', 'nav.shelf': 'Araçlar', 'nav.verify': 'Doğrulama', 'nav.issues': 'Sorunlar',
    'hero.over': 'Bir Scoop bucket’ı · Windows · kurulum programı yok · yönetici yetkisi yok',
    'hero.a': 'araç.', 'hero.b': 'Tek satır.',
    'hero.lede': 'Küçük Windows araçları; her biri tek exe, her biri tek bir işi düzgün yapıyor. Bucket’ı bir kez ekle, scoop update hepsini güncel tutsun.',
    's.over': '01 — İçinde ne var', 's.h': 'İstediğini seç. Komut kendini yazsın.', 's.list': 'Bucket’taki uygulamalar',
    'b.k': 'seçili', 'b.of': '/', 'b.run': 'Kurulumu önizle', 'b.hint': 'Önizleme Scoop’un yazdığını yazar. Komutu kendin yapıştırana kadar makinende hiçbir şey çalışmaz.',
    'n.1': 'wymcmd x64 ve arm64 derlemeleriyle gelir, Scoop doğru olanı seçer. Diğerleri yalnızca x64.',
    'n.2': 'tlk-tune iki adla kurulur: tlk-tune ve tune.', 'n.3': 'tlk-pdf Başlat menüsüne eklenir ve dosya açan bir komut getirir.',
    'v.over': '02 — Kurduğunu doğrulamak',
    'v.h': 'Checksum sağlam geldiğini söyler. <span class="hl">Attestation kimin derlediğini.</span>',
    'v.p': 'Derlemeler bir GitHub attestation’ı taşır; Scoop’un indirdiği exe, onu üreten commit’e ve iş akışı çalışmasına kadar izlenebilir.',
    'c.big': '<span class="hl">excavator</span> her gün çalışır.',
    'c.p': 'Upstream’de yeni bir sürüm fark eder, manifesti günceller ve commit’ler. Bir sürümün yapısı değişmedikçe burada hiçbir şey elle güncellenmez.',
    'i.over': '03 — Sorun bildirmek', 'i.p1': 'Bir araçtaki hata o aracın kendi deposuna aittir. Buraya yalnızca paketlemenin kendisi hatalıysa issue aç:',
    'i.a': 'yanlış mimariyi kuran bir manifest', 'i.b': 'PATH’te görünmeyen bir shim', 'i.c': 'artık eşleşmeyen bir hash',
    'l.over': 'Lisans', 'l.p': 'Buradaki manifestler MIT. Yalnızca başka yerde yayımlanan yazılımın nasıl kurulacağını anlatırlar; her uygulamanın kendi lisansı yukarıdaki kartında yazar.',
    'copy': 'Kopyala', 'copied': 'Kopyalandı', 'foot.sec': 'Güvenlik',
    'site': 'site', 'source': 'kaynak', 'updated': 'manifestler son güncelleme', 'ago.d': 'gün önce', 'ago.h': 'saat önce', 'ago.now': 'az önce', 'cached': 'önbellekteki liste'
  };
  const EN = { 'copied': 'Copied', 'site': 'site', 'source': 'source', 'updated': 'manifests last updated', 'ago.d': 'days ago', 'ago.h': 'hours ago', 'ago.now': 'just now', 'cached': 'cached list' };
  const WORDS = { en: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'], tr: ['Sıfır', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On'] };
  let lang = 'en';
  const t = k => (lang === 'tr' ? TR[k] : EN[k]) ?? '';
  const orig = new Map();
  const keep = (el, a, get) => { if (!orig.has(el)) orig.set(el, {}); const o = orig.get(el); if (!(a in o)) o[a] = get(); return o[a]; };
  function applyLang(l) {
    lang = l; root.lang = l;
    const tr = k => l === 'tr' ? TR[k] : undefined;
    $$('[data-i18n]').forEach(el => { const en = keep(el, 't', () => el.textContent); el.textContent = tr(el.dataset.i18n) ?? en; });
    $$('[data-i18n-html]').forEach(el => { const en = keep(el, 'h', () => el.innerHTML); el.innerHTML = tr(el.dataset.i18nHtml) ?? en; });
    $$('[data-i18n-aria]').forEach(el => { const en = keep(el, 'a', () => el.getAttribute('aria-label')); el.setAttribute('aria-label', tr(el.dataset.i18nAria) ?? en); });
    renderApps(); count(); fresh();
    try { localStorage.setItem('scoop-tlk-lang', l); } catch {}
  }
  $('.lang').addEventListener('click', () => applyLang(lang === 'en' ? 'tr' : 'en'));
  addEventListener('scroll', () => document.body.classList.toggle('scrolled', scrollY > 8), { passive: true });

  /* ---------- manifests, read live from the bucket ---------- */
  // shortcut: used only when GitHub cannot be reached; versions here go stale, the live fetch does not.
  const FALLBACK = [
    { name: 'wymcmd', version: '0.3.1', license: 'Freeware', description: 'Explains why a console window opened - which scheduled task, service, registry key or click started it.', homepage: 'https://github.com/Talkdedsec/tlk-wymcmd', arch: ['64bit', 'arm64'], shims: ['wymcmd'] },
    { name: 'tlk-visual', version: '0.2.0', license: 'GPL-3.0-or-later', description: 'Real-time screen colour engine - brightness, contrast, gamma, temperature and night vision written to the display gamma ramp.', homepage: 'https://github.com/Talkdedsec/tlk-visual', arch: ['64bit'], shims: ['talkdedsec-visual'] },
    { name: 'tlk-tune', version: '0.2.0', license: 'MIT', description: 'Terminal music player: album art, synced lyrics, ten-band equaliser, mouse and keyboard.', homepage: 'https://github.com/Talkdedsec/tlk-tune', arch: ['64bit'], shims: ['tlk-tune', 'tune'] },
    { name: 'wsmf', version: '0.1.1', license: 'MIT', description: 'Finds out which Windows application steals your keyboard focus, and stops it. Tray program, no keyboard hook.', homepage: 'https://github.com/Talkdedsec/tlk-wsmf', arch: ['64bit'], shims: ['wsmf'] },
    { name: 'tlk-pdf', version: '1.0.1', license: 'MIT', description: 'PDF editor that runs on your device: text, signatures, form filling, highlights, white-out, merge, split, reorder and rotate pages.', homepage: 'https://github.com/Talkdedsec/tlk-pdf', arch: ['64bit'], shims: ['tlk-pdf'] }
  ];
  const ACC = { 'tlk-tune': '#ff8a1f', wsmf: '#6cb2ff', 'tlk-visual': '#b5f23d', wymcmd: '#3fe0a5', 'tlk-pdf': '#ff6b8b' };
  function shimsOf(bin) {
    const list = Array.isArray(bin) ? bin : bin ? [bin] : [];
    return list.map(b => Array.isArray(b) ? (b[1] || b[0].replace(/\.exe$/i, '')) : String(b).replace(/\.exe$/i, '').split(/[\\/]/).pop());
  }
  const fromManifest = (name, m) => ({
    name, version: m.version, description: m.description, homepage: m.homepage,
    license: typeof m.license === 'string' ? m.license : (m.license && m.license.identifier) || '—',
    arch: Object.keys(m.architecture || {}), shims: shimsOf(m.bin)
  });
  let apps = FALLBACK, live = false, lastCommit = null;
  const selected = new Set(FALLBACK.map(a => a.name));
  async function load() {
    try {
      const list = await (await fetch(`https://api.github.com/repos/${REPO}/contents/bucket`)).json();
      const names = list.filter(f => f.name.endsWith('.json')).map(f => f.name.slice(0, -5));
      const got = await Promise.all(names.map(async n => fromManifest(n, await (await fetch(`https://raw.githubusercontent.com/${REPO}/main/bucket/${n}.json`)).json())));
      const order = FALLBACK.map(a => a.name);
      got.sort((a, b) => (order.indexOf(a.name) + 1 || 99) - (order.indexOf(b.name) + 1 || 99));
      apps = got; live = true;
      got.forEach(a => { if (!order.includes(a.name)) selected.add(a.name); });
      renderApps(); count();
    } catch { /* keep the fallback */ }
    try {
      const c = await (await fetch(`https://api.github.com/repos/${REPO}/commits?path=bucket&per_page=1`)).json();
      lastCommit = new Date(c[0].commit.committer.date); fresh();
    } catch {}
  }
  function fresh() {
    const el = $('#fresh');
    if (!lastCommit) { el.textContent = live ? '' : t('cached'); return; }
    const h = (Date.now() - lastCommit) / 36e5;
    el.textContent = t('updated') + ' · ' + (h < 1 ? t('ago.now') : h < 48 ? Math.round(h) + ' ' + t('ago.h') : Math.round(h / 24) + ' ' + t('ago.d'));
  }

  /* ---------- shelf + command builder ---------- */
  const appsEl = $('.apps'), cmd = $('#cmd'), out = $('.out');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const site = h => { const m = /github\.com\/Talkdedsec\/([^/]+)/.exec(h || ''); return m ? `https://talkdedsec.github.io/${m[1]}/` : h; };
  function renderApps() {
    appsEl.innerHTML = apps.map((a, i) => `
      <li class="app" style="--i:${i};--acc:${ACC[a.name] || '#ffd600'}">
        <input type="checkbox" id="app-${esc(a.name)}" value="${esc(a.name)}" ${selected.has(a.name) ? 'checked' : ''}>
        <label for="app-${esc(a.name)}">
          <span class="app-top"><span class="app-name">${esc(a.name)}</span><span class="tick" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="#1a1a1a" stroke-width="2.4"/></svg></span></span>
          <span class="app-desc">${esc(a.description)}</span>
          <span class="app-tags"><span class="v">v${esc(a.version)}</span><span>${esc(a.license)}</span><span>${esc(a.arch.join(' · ') || 'x64')}</span>${a.shims.map(s => `<span>› ${esc(s)}</span>`).join('')}</span>
          <span class="app-links"><a href="${esc(site(a.homepage))}">${t('site')} ↗</a><a href="${esc(a.homepage)}">${t('source')} ↗</a></span>
        </label>
      </li>`).join('');
    $$('input', appsEl).forEach(inp => inp.addEventListener('change', () => { inp.checked ? selected.add(inp.value) : selected.delete(inp.value); count(); }));
    $('#h-count').textContent = (WORDS[lang][apps.length] || apps.length);
  }
  function count() {
    const sel = apps.filter(a => selected.has(a.name));
    const n = $('#sel-n');
    if (n.textContent !== String(sel.length)) { n.textContent = sel.length; n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); }
    $('#sel-t').textContent = apps.length;
    cmd.innerHTML = `<span class="p">PS&gt;</span> scoop bucket add tlk https://github.com/${REPO}\n` +
      (sel.length ? `<span class="p">PS&gt;</span> scoop install ${sel.map(a => `<span class="c">tlk/${esc(a.name)}</span>`).join(' ')}` : `<span class="p"># …</span>`);
    $('#run').disabled = !sel.length;
    out.innerHTML = '';
  }
  let playing = 0;
  $('#run').addEventListener('click', async () => {
    const my = ++playing, sel = apps.filter(a => selected.has(a.name));
    const lines = [['Checking repo... OK', ''], ['The tlk bucket was added successfully.', 'ok']];
    for (const a of sel) {
      const arch = a.arch.includes('64bit') ? '64bit' : a.arch[0] || '64bit';
      lines.push([`Installing '${a.name}' (${a.version}) [${arch}] from 'tlk' bucket`, 'y'], ['Checking hash ... ok.', ''], [`Linking ~\\scoop\\apps\\${a.name}\\current => ~\\scoop\\apps\\${a.name}\\${a.version}`, '']);
      a.shims.forEach(s => lines.push([`Creating shim for '${s}'.`, '']));
      lines.push([`'${a.name}' (${a.version}) was installed successfully!`, 'ok']);
    }
    out.innerHTML = '';
    for (const [text, cls] of lines) {
      if (my !== playing) return;
      const li = document.createElement('li'); li.textContent = text; if (cls) li.className = cls; out.append(li);
      if (!reduce) await new Promise(r => setTimeout(r, cls === 'y' ? 260 : 110));
    }
  });

  /* ---------- copy + reveals ---------- */
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    const src = $(b.dataset.copy);
    const text = src.id === 'cmd' ? src.textContent.replace(/^PS> /gm, '') : src.textContent;
    try { await navigator.clipboard.writeText(text); } catch { return; }
    b.textContent = t('copied'); b.classList.add('ok');
    setTimeout(() => { b.textContent = lang === 'tr' ? TR.copy : 'Copy'; b.classList.remove('ok'); }, 1400);
  }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  let saved = null;
  try { saved = localStorage.getItem('scoop-tlk-lang'); } catch {}
  const q = new URLSearchParams(location.search).get('lang');
  applyLang(q === 'tr' || q === 'en' ? q : saved || (/^tr\b/i.test(navigator.language) ? 'tr' : 'en'));
  load();
})();
