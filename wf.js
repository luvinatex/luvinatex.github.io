/* LUVINA White Friday 2026 — shows until Sun 29 Nov 2026 23:59 Cairo, then removes itself */
(function () {
  var END = Date.parse('2026-11-29T23:59:59+02:00');
  if (!(Date.now() < END)) return;

  var MAP = 'https://maps.google.com/?q=30.0918755,31.3071446';
  var WA = 'https://wa.me/201270455444?text=' + encodeURIComponent('أهلاً لوفينا 🤍 عايز أعرف تفاصيل عرض الوايت فرايداي');
  function ar() { return document.documentElement.lang !== 'en'; }
  function T(a, e) { return ar() ? a : e; }

  var css = '' +
    '#wfb{position:relative;z-index:60;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;padding:11px 16px;background:linear-gradient(90deg,#C6F000 0%,#C6F000 46%,#FF1F8E 54%,#FF1F8E 100%);color:#111;font-family:var(--f-ar,"Alexandria",sans-serif);font-size:14px;line-height:1.35;text-align:center;cursor:pointer;overflow:hidden}' +
    'html[lang=en] #wfb{font-family:var(--f-en,"Inter",sans-serif)}' +
    '#wfb::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);transform:translateX(-100%);animation:wfsh 3.2s ease-in-out infinite}' +
    '@keyframes wfsh{0%{transform:translateX(-100%)}60%,100%{transform:translateX(100%)}}' +
    '#wfb .t{font-family:"Bodoni Moda",Georgia,serif;font-size:19px;letter-spacing:.14em;color:#fff;background:#111;padding:3px 12px;border-radius:6px;direction:ltr}' +
    '#wfb .p{font-weight:600;font-size:16px}' +
    '#wfb .d{opacity:.85}' +
    '#wfb .go{background:#fff;color:#111;border-radius:980px;padding:6px 14px;font-weight:500;font-size:13px}' +
    '#wfm{position:fixed;inset:0;z-index:95;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(17,17,17,.62);opacity:0;pointer-events:none;transition:opacity .35s}' +
    '#wfm.on{opacity:1;pointer-events:auto}' +
    '#wfm .c{position:relative;width:100%;max-width:420px;max-height:92vh;overflow:auto;background:#FDFBF8;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,.35);transform:scale(.94);transition:transform .45s cubic-bezier(.28,.11,.32,1)}' +
    '#wfm.on .c{transform:none}' +
    '#wfm img{display:block;width:100%;height:auto;border-radius:22px 22px 0 0}' +
    '#wfm .b{display:flex;gap:10px;padding:14px;font-family:var(--f-ar,"Alexandria",sans-serif)}' +
    'html[lang=en] #wfm .b{font-family:var(--f-en,"Inter",sans-serif)}' +
    '#wfm .b a{flex:1;text-align:center;text-decoration:none;border-radius:980px;padding:13px 10px;font-size:14px;font-weight:500}' +
    '#wfm .b .m{background:#111;color:#fff}' +
    '#wfm .b .w{background:#FF1F8E;color:#fff}' +
    '#wfm .c{overflow:visible;margin-top:44px}#wfm .x{position:absolute;top:-48px;inset-inline-end:0;width:40px;height:40px;border:0;border-radius:50%;background:rgba(17,17,17,.7);color:#fff;font-size:22px;line-height:40px;cursor:pointer}' +
    '@media(max-width:560px){#wfb{gap:8px;font-size:13px}#wfb .t{font-size:16px}#wfb .d{flex-basis:100%}}';

  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var bar = document.createElement('div'); bar.id = 'wfb'; bar.setAttribute('role', 'button');
    bar.innerHTML = '<span class="t">WHITE FRIDAY</span>' +
      '<span class="p">' + T('٢٥٪ خصم على فاتورتك', '25% off your invoice') + '</span>' +
      '<span class="d">' + T('الخميس ٢٦ • السبت ٢٨ • الأحد ٢٩ نوفمبر — داخل المقر', 'Thu 26 • Sat 28 • Sun 29 Nov — in store') + '</span>' +
      '<span class="go">' + T('التفاصيل', 'Details') + '</span>';
    document.body.insertBefore(bar, document.body.firstChild);

    var m = document.createElement('div'); m.id = 'wfm';
    m.innerHTML = '<div class="c" role="dialog" aria-label="White Friday">' +
      '<button class="x" type="button" aria-label="Close">×</button>' +
      '<img src="/wf-2026.jpg" alt="LUVINA White Friday — 25% off" width="1080" height="1440">' +
      '<div class="b"><a class="m" target="_blank" rel="noopener" href="' + MAP + '">' + T('📍 لوكيشن المقر', '📍 Our location') + '</a>' +
      '<a class="w" target="_blank" rel="noopener" href="' + WA + '">' + T('اسأل على واتساب', 'Ask on WhatsApp') + '</a></div></div>';
    document.body.appendChild(m);

    function open() { m.classList.add('on'); }
    function close() { m.classList.remove('on'); }
    bar.addEventListener('click', open);
    m.addEventListener('click', function (e) { if (e.target === m || e.target.classList.contains('x')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    var seen = null;
    try { seen = sessionStorage.getItem('lv_wf26'); sessionStorage.setItem('lv_wf26', '1'); } catch (e) {}
    if (!seen) setTimeout(open, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
