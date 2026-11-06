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
    '<a class="b" href="' + u(msgBook) + '" target="_blank" rel="noopener">' +
      '<span class="ar">اطلب كتالوج لوفينا <small>· هدية مع طلبك</small></span>' +
      '<span class="en">Get the Luvina Catalogue <small>· a gift with your order</small></span>' +
    '</a>' +
    '<a class="w" href="' + u(msgAsk) + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ico + '</a>';

  function mount() {
    document.body.appendChild(bar);
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
