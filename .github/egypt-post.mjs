// Refreshes Egypt Post air-parcel prices (CP_AIR) for Luvina's international shipping calculator.
// Runs daily on GitHub Actions and writes shipping/egypt-post.json
import fs from "node:fs";
const BASE = "https://egyptpost.gov.eg/ar-eg";
const WANT = ["السعودية","الإمارات","الكويت","قطر","البحرين","عمان","الأردن","لبنان","العراق","ليبيا","تونس","الجزائر","المغرب","السودان","اليمن","فلسطين","سوريا","تركيا","الولايات المتحدة","كندا","بريطانيا","فرنسا","ألمانيا","إيطاليا","هولندا","بلجيكا","إسبانيا","أستراليا","نيجيريا"];
const MAXKG = 30;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function post(weight, id, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(BASE + "/CalculatePostage/CalculatePostalFees", {
        method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 LuvinaShippingBot" },
        body: JSON.stringify({ shippingType: "International", serviceType: "", originGovernorateId: 0, destinationGovernorateId: 0, isCod: 0, weightInGrams: weight, destinationCountryId: +id })
      });
      const j = await r.json();
      if (j.success) { const c = (j.data || []).find(x => x.serviceSubCode === "CP_AIR"); return c ? c.servicePrice : null; }
    } catch (e) {}
    await sleep(1500);
  }
  return undefined;
}
const prevFile = "shipping/egypt-post.json";
const prev = fs.existsSync(prevFile) ? JSON.parse(fs.readFileSync(prevFile, "utf8")) : null;
const all = (await (await fetch(BASE + "/Countries/GetAllCountries")).json()).data;
const nz = s => String(s).replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").trim();
const countries = all.filter(c => WANT.some(w => nz(c.currentName).includes(nz(w))) && !/جنوب السودان/.test(c.currentName));
const out = { source: "egyptpost.gov.eg — الطرود (جوي) CP_AIR", updated: new Date().toISOString(), maxKg: MAXKG, countries: [] };
let ok = 0;
async function pool(items, n, fn) { const res = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; res[k] = await fn(items[k]); } })); return res; }
for (const c of countries) {
  const prices = {}, kgs = Array.from({ length: MAXKG }, (_, i) => i + 1);
  const got = await pool(kgs, 6, kg => post(kg * 1000, c.id));
  kgs.forEach((kg, i) => { const p = got[i];
    if (p === undefined) { const old = prev && prev.countries.find(x => x.id === c.id); if (old && old.prices[kg] != null) prices[kg] = old.prices[kg]; }
    else if (p !== null) { prices[kg] = p; ok++; } });
  if (Object.keys(prices).length) out.countries.push({ id: c.id, name: c.currentName.trim(), prices });
  console.log(c.currentName, Object.keys(prices).length);
}
if (!ok && prev) { console.log("Egypt Post unreachable, keeping previous file"); process.exit(0); }
fs.mkdirSync("shipping", { recursive: true });
fs.writeFileSync(prevFile, JSON.stringify(out));
