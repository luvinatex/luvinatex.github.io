/* Luvina visitor analytics: Google Analytics 4 + Microsoft Clarity */
(function () {
  var GA_ID = 'G-KJ9BLSQZH1';
  var CLARITY_ID = 'z8xvnew1l6';

  // Google Analytics 4
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);

  // Microsoft Clarity (session recordings + heatmaps)
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);

  // Count WhatsApp clicks as leads in Analytics
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var h = a.href || '';
    if (/wa\.me|whatsapp/i.test(h)) {
      gtag('event', 'generate_lead', { method: 'whatsapp', page: location.pathname });
      if (window.clarity) clarity('event', 'whatsapp_click');
    }
  }, true);
})();
