/* Luvina catalogue request form — saves the lead to the Luvina Leads sheet, then opens WhatsApp */
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbx0trffk9vSkrEn9FXTmosjB5lr__mEFCwHYHz0PdD73tEfJxscQF8bO4MZrXeTEjJUkA/exec';
  var WA = '201270455444';
  var GOV = ['القاهرة','الجيزة','القليوبية','الإسكندرية','الدقهلية','الشرقية','الغربية','المنوفية','كفر الشيخ','البحيرة','دمياط','بورسعيد','الإسماعيلية','السويس','الفيوم','بني سويف','المنيا','أسيوط','سوهاج','قنا','الأقصر','أسوان','البحر الأحمر','مطروح','شمال سيناء','جنوب سيناء','الوادي الجديد','خارج مصر'];
  var KEY = 'lv_lead';
  var built = false, box;

  function ar() { return document.documentElement.lang !== 'en'; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  function build() {
    if (built) return; built = true;
    var css = '' +
      '#lvf{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:rgba(61,51,48,.38);opacity:0;pointer-events:none;transition:opacity .35s;font-family:var(--f-ar,"Alexandria",sans-serif)}' +
      'html[lang=en] #lvf{font-family:var(--f-en,"Inter",sans-serif)}' +
      '#lvf.on{opacity:1;pointer-events:auto}' +
      '#lvf .s{width:100%;max-width:440px;background:#FDFBF8;color:#3D3330;border-radius:22px 22px 0 0;padding:26px 22px calc(22px + env(safe-area-inset-bottom,0px));transform:translateY(30px);transition:transform .45s cubic-bezier(.28,.11,.32,1);box-shadow:0 -10px 40px rgba(61,51,48,.18);max-height:92vh;overflow:auto}' +
      '#lvf.on .s{transform:none}' +
      '@media(min-width:600px){#lvf{align-items:center}#lvf .s{border-radius:22px}}' +
      '#lvf .x{position:absolute;margin-top:-14px;inset-inline-end:14px;background:none;border:0;font-size:24px;color:#8E7F76;width:44px;height:44px;cursor:pointer}' +
      '#lvf h3{margin:0 0 6px;font-weight:500;font-size:21px;letter-spacing:0}' +
      '#lvf .k{margin:0 0 4px;font-size:14px;color:#3D3330}' +
      '#lvf .n{margin:0 0 18px;font-size:12.5px;color:#8E7F76;line-height:1.7}' +
      '#lvf label{display:block;font-size:12.5px;color:#8E7F76;margin:0 0 6px}' +
      '#lvf input,#lvf select{width:100%;box-sizing:border-box;font:inherit;font-size:16px;color:#3D3330;background:#fff;border:1px solid #EAE0D7;border-radius:12px;padding:12px 14px;margin:0 0 14px;outline:none;-webkit-appearance:none;appearance:none}' +
      '#lvf input:focus,#lvf select:focus{border-color:#B9A79A}' +
      '#lvf .e{border-color:#C98A7E}' +
      '#lvf button[type=submit]{width:100%;border:0;border-radius:980px;background:#3D3330;color:#FDFBF8;font:inherit;font-size:15px;font-weight:500;padding:15px;cursor:pointer;margin-top:4px}' +
      '#lvf .p{margin:12px 0 0;text-align:center;font-size:11.5px;color:#8E7F76}' +
      'html[lang=ar] #lvf .en,html[lang=en] #lvf .ar{display:none}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var opts = '<option value="" disabled selected></option>' + GOV.map(function (g) { return '<option>' + g + '</option>'; }).join('');
    box = document.createElement('div');
    box.id = 'lvf'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML =
      '<form class="s" novalidate>' +
        '<button type="button" class="x" aria-label="close">×</button>' +
        '<h3><span class="ar">كتالوج لوفينا</span><span class="en">The Luvina Catalogue</span></h3>' +
        '<p class="k"><span class="ar">مئة لون من التل السويسري بين يديك — هدية مع أول طلب.</span><span class="en">One hundred shades of Swiss tulle in your hands — a gift with your first order.</span></p>' +
        '<p class="n"><span class="ar">ولمن يرغب في الكتالوج وحده: ٣٥٠ ج.م تُخصم بالكامل من أول طلب.</span><span class="en">On its own: EGP 350, credited in full against your first order.</span></p>' +
        '<label><span class="ar">الاسم</span><span class="en">Name</span></label><input name="name" autocomplete="name" maxlength="60" required>' +
        '<label><span class="ar">اسم الأتيليه أو المصنع</span><span class="en">Atelier or factory name</span></label><input name="atelier" autocomplete="organization" maxlength="80" required>' +
        '<label><span class="ar">رقم الواتساب</span><span class="en">WhatsApp number</span></label><input name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" required>' +
        '<label><span class="ar">المحافظة</span><span class="en">Governorate</span></label><select name="gov" required>' + opts + '</select>' +
        '<button type="submit"><span class="ar">تابع عبر واتساب</span><span class="en">Continue on WhatsApp</span></button>' +
        '<p class="p"><span class="ar">بياناتك لدى لوفينا فقط، لتجهيز الكتالوج لك.</span><span class="en">Your details stay with Luvina, only to prepare your catalogue.</span></p>' +
      '</form>';
    document.body.appendChild(box);

    var f = box.querySelector('form');
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    box.querySelector('.x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    var saved = store(KEY);
    if (saved) { f.name.value = saved.name || ''; f.atelier.value = saved.atelier || ''; if (saved.gov) f.gov.value = saved.gov; }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = { name: f.name.value.trim(), atelier: f.atelier.value.trim(), phone: f.phone.value.replace(/[^0-9+]/g, ''), gov: f.gov.value };
      var bad = false;
      ['name', 'atelier', 'phone', 'gov'].forEach(function (k) { var ok = k === 'phone' ? /^\+?\d{10,15}$/.test(d[k]) : d[k].length > 1; f[k].classList.toggle('e', !ok); if (!ok) bad = true; });
      if (bad) return;
      store(KEY, d);

      var q = new URLSearchParams(location.search);
      var payload = Object.assign({}, d, {
        source: q.get('utm_source') || (document.referrer ? new URL(document.referrer).hostname : 'direct'),
        campaign: q.get('utm_campaign') || '', page: location.pathname, lang: ar() ? 'ar' : 'en'
      });
      try {
        var body = JSON.stringify(payload);
        if (!(navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))))
          fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, body: body });
      } catch (err) {}

      try { window.fbq && fbq('track', 'Lead', { content_name: 'catalogue_form' }); } catch (err) {}
      try { window.gtag && gtag('event', 'generate_lead', { method: 'catalogue_form' }); } catch (err) {}

      var msg = 'أهلاً لوفينا 👋\nأرغب في كتالوج لوفينا (هدية مع أول طلب).\n' +
        'الاسم: ' + d.name + '\nالأتيليه / المصنع: ' + d.atelier + '\nالرقم: ' + d.phone + '\nالمحافظة: ' + d.gov;
      var wa = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
      var w = window.open(wa, '_blank');
      if (w) { try { w.opener = null; } catch (err) {} } else { location.href = wa; }
      close();
    });
  }

  function open(e) { if (e) e.preventDefault(); build(); box.classList.add('on'); setTimeout(function () { var i = box.querySelector('input'); if (i && !i.value) i.focus(); }, 300); }
  function close() { box && box.classList.remove('on'); }

  window.LuvinaForm = { open: open, bind: function (el) { el && el.addEventListener('click', open); } };
  if (location.hash === '#catalog-form') document.addEventListener('DOMContentLoaded', function () { open(); });
})();

/* Luvina floating WhatsApp bar — turns visitors into WhatsApp chats */
(function () {
  var p = location.pathname;
  if (!(p === '/' || /\/index\.html$/.test(p))) return; // colors page has its own bar
  if (document.getElementById('lvc')) return;

  var WA = '201270455444';
  var msgBook = 'أهلاً لوفينا 👋\nعايز أطلب كتالوج لوفينا (هدية مع طلبي).\nالاسم:\nالمحافظة:';
  var msgAsk = 'أهلاً لوفينا 👋\nعندي استفسار عن التل السويسري.';
  var u = function (m) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(m); };

  var css = '' +
    '#lvc{position:fixed;z-index:70;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translate(-50%,140%);' +
    'display:flex;align-items:center;gap:8px;padding:7px;border-radius:980px;background:rgba(253,251,248,.92);' +
    '-webkit-backdrop-filter:saturate(180%) blur(18px);backdrop-filter:saturate(180%) blur(18px);' +
    'box-shadow:0 10px 34px rgba(61,51,48,.16),0 0 0 1px rgba(234,224,215,.9);transition:transform .55s cubic-bezier(.28,.11,.32,1),opacity .4s;opacity:0;' +
    'width:max-content;max-width:calc(100vw - 24px);font-family:var(--f-ar,"Alexandria",sans-serif)}' +
    'html[lang=en] #lvc{font-family:var(--f-en,"Inter",sans-serif)}' +
    '#lvc.on{transform:translate(-50%,0);opacity:1}' +
    '#lvc a{display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border-radius:980px;white-space:nowrap;line-height:1}' +
    '#lvc .b{background:#3D3330;color:#FDFBF8;padding:13px 20px;font-size:14px;font-weight:500}' +
    '#lvc .b small{opacity:.7;font-size:12px;font-weight:400}' +
    '#lvc .w{background:#25D366;color:#fff;width:44px;height:44px;flex:0 0 44px}' +
    '#lvc .w svg{width:23px;height:23px}' +
    '#lvc .b:active,#lvc .w:active{transform:scale(.97)}' +
    'html[lang=ar] #lvc .en,html[lang=en] #lvc .ar{display:none}' +
    '@media(max-width:360px){#lvc .b small{display:none}}';

  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  var ico = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8M20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 .1 5.3.1 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6c1.8 1 3.8 1.5 5.7 1.5 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.5"/></svg>';

  var bar = document.createElement('div');
  bar.id = 'lvc';
  bar.setAttribute('role', 'complementary');
  bar.innerHTML =
    '<a class="b" href="#catalog-form" data-lvf="1">' +
      '<span class="ar">اطلب كتالوج لوفينا <small>· هدية مع أول طلب</small></span>' +
      '<span class="en">Get the Luvina Catalogue <small>· a gift with your first order</small></span>' +
    '</a>' +
    '<a class="w" href="' + u(msgAsk) + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ico + '</a>';

  function mount() {
    document.body.appendChild(bar);
    window.LuvinaForm && LuvinaForm.bind(bar.querySelector('[data-lvf]'));
    var order = document.getElementById('order');
    var overlay = document.querySelector('.overlay');
    var orderVisible = false, nudged = false;

    function update() {
      var scrolled = nudged || window.scrollY > Math.min(260, window.innerHeight * 0.35);
      var menuOpen = overlay && getComputedStyle(overlay).opacity !== '0' && getComputedStyle(overlay).pointerEvents !== 'none';
      bar.classList.toggle('on', scrolled && !orderVisible && !menuOpen);
    }

    if (order && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        orderVisible = es[0].isIntersecting; update();
      }, { threshold: 0.08 }).observe(order);
    }
    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('click', function () { setTimeout(update, 450); }, true);
    setTimeout(function () { nudged = true; update(); }, 6000); // nudge after 6s even without scrolling
    update();
  }

  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
