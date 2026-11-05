/* Luvina Team: reads luvinatex.com live and refreshes prices/products in the assistant */
(function(){
  var AD="٠١٢٣٤٥٦٧٨٩";
  function num(s){return +String(s).replace(/[٠-٩]/g,function(d){return AD.indexOf(d)}).replace(/[^\d]/g,"")}
  function fmt(n){return n.toLocaleString("en-US")}
  function parse(html){
    var doc=new DOMParser().parseFromString(html,"text/html");
    doc.querySelectorAll(".en,script,style").forEach(function(e){e.remove()});
    var t=(doc.body.textContent||"").replace(/\s+/g," ");
    var f={at:new Date().toISOString().slice(0,10)};
    var m=t.match(/عرض ١٦٠ سم\s*التوب [^·]*·\s*([\d,]+)\s*EGP/);if(m)f.w160=num(m[1]);
    m=t.match(/عرض ٣ متر\s*التوب [^·]*·\s*([\d,]+)\s*EGP/);if(m)f.w3=num(m[1]);
    m=t.match(/كتاب الألوان المئة بـ\s*([٠-٩\d,]+)/);if(m)f.catalog=num(m[1]);
    var m2=html.match(/id:'t160'[^}]*?price:(\d+)/);if(m2)f.w160=+m2[1];
    m2=html.match(/id:'t3m'[^}]*?price:(\d+)/);if(m2)f.w3=+m2[1];
    m2=html.match(/var TIERS=(\[\[[\d,\[\]]+\]\])/);if(m2){try{f.tiers=JSON.parse(m2[1]).map(function(x){return [x[0],x[1]]}).sort(function(a,b){return b[0]-a[0]})}catch(e){}}
    var lace=[],re=/name:'([^']+)',ar:'[^']*',price:(\d+),out:(true|false)/g;while((m=re.exec(html)))lace.push({n:m[1],p:+m[2],ok:m[3]==="false"});
    if(lace.length)f.lace=lace;
    return f.w160?f:null;
  }
  function apply(f){
    if(!f||typeof KB==="undefined"||!KB||!KB.entries)return;
    try{
      PRICES.w160=f.w160||PRICES.w160;PRICES.w3=f.w3||PRICES.w3;
      if(f.tiers){TIERS.length=0;f.tiers.forEach(function(x){TIERS.push(x)})}
      var av=(f.lace||[]).filter(function(l){return l.ok});if(av.length)PRICES.lace=av[0].p;
      var E={};KB.entries.forEach(function(e){E[e.id]=e});
      var src="\n\n🔄 محدّث من الموقع: "+f.at;
      if(E.prices)E.prices.a="**التل السويسري — بالتوب الكامل (٢٥ متر):**\n• عرض **١٦٠ سم** ← **"+fmt(PRICES.w160)+" ج** للتوب\n• عرض **٣ متر** ← **"+fmt(PRICES.w3)+" ج** للتوب\n\nنفس السعر لكل الألوان.\nتوب واحد بالسعر المعلن، ومن **"+TIERS[TIERS.length-1][0]+" أتواب** بيبدأ خصم الشركاء.\n\n💡 لو العميل سأل عن السعر بس، اسأله **\"بتشتغل في إيه؟ أتيليه ولا تجارة ولا مصنع؟\"** عشان تبني الكلام على احتياجه."+src;
      if(E.tiers&&f.tiers)E.tiers.a="**شرائح خصم الشركاء — على التل السويسري بس:**\n"+TIERS.slice().reverse().map(function(x){return "• من **"+x[0]+"** توب ← **"+x[1]+"%**"}).join("\n")+"\n\n⚠️ الدانتيل الفرنسي (الفرنش ليس) **مش داخل** في الخصم.\n\n💡 اكتب الكمية زي **\"٣٠ توب ١٦٠\"** وأنا أحسبلك الفاتورة بالخصم."+src;
      if(E.lace&&f.lace)E.lace.a="**الدانتيل الفرنسي — بيتباع بالكوب (٣ م × ١.٥ م):**\n"+f.lace.map(function(l){return "• "+l.n+" ← "+(l.ok?"**"+fmt(l.p)+" ج** للكوب — متاح":fmt(l.p)+" ج — **نفد**")}).join("\n")+"\n\nاسمه **\"كوب\"** مش \"كوبون\".\n⚠️ مش داخل في خصم الشركاء.\n\nلفساتين الزفاف والسهرة والهوت كوتور."+src;
      if(E.catalog&&f.catalog)E.catalog.a=E.catalog.a.replace(/\*\*\d[\d,]*\s*ج\*\*/,"**"+fmt(f.catalog)+" ج**");
      KB._p=0;
    }catch(e){}
  }
  try{apply(JSON.parse(localStorage.getItem("lv_site")||"null"))}catch(e){}
  if(location.protocol!=="file:"&&navigator.onLine){
    fetch("/?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.text()}).then(function(h){
      var f=parse(h);if(f){try{localStorage.setItem("lv_site",JSON.stringify(f))}catch(e){}apply(f)}}).catch(function(){});
  }
  /* ask Mahmoud on WhatsApp when the assistant has no answer */
  document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-wa]");if(!b)return;
    var who=(typeof ME!=="undefined"&&ME&&ME.name)||"";
    window.open("https://wa.me/201270455444?text="+encodeURIComponent("سؤال من "+who+" (مساعد لوفينا):\n"+b.dataset.wa),"_blank")});
  var obs=new MutationObserver(function(){var bs=document.querySelectorAll("#msgs .msg.bot .bub");var last=bs[bs.length-1];
    if(last&&!last.dataset.waDone&&last.textContent.indexOf("مش لاقي إجابة أكيدة")>-1){last.dataset.waDone=1;
      var qs=document.querySelectorAll("#msgs .msg.me .bub"),q=qs.length?qs[qs.length-1].textContent:"";
      var btn=document.createElement("button");btn.className="chip";btn.style.cssText="margin-top:10px;background:#25D366;color:#fff;border-color:#25D366";
      btn.textContent="ابعت السؤال لمحمود على واتساب";btn.dataset.wa=q;last.appendChild(btn)}});
  var go=function(){var m=document.getElementById("msgs");if(m)obs.observe(m,{childList:true,subtree:true})};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();
