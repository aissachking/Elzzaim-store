/* Elzzaim Telecom — boutique (SPA légère, sans dépendances) */
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $("#app");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ico = (id, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- textes ---------------- */
const T = {
  ar: {
    home: "الرئيسية", shop: "المتجر", cats: "الأصناف", services: "الخدمات", contact: "اتصل بنا", cart: "السلة",
    heroKick: "غرداية · توصيل لـ 58 ولاية", heroA: "إكسسوارات هاتفك", heroB: "بلمسة الزعيم",
    heroP: "ساعات، نظارات، سماعات، مكبرات صوت وكل ما يحتاجه هاتفك — مع تصليح احترافي وفليكسي لجميع المتعاملين.",
    shopNow: "تسوّق الآن", repair: "خدمة التصليح", catKick: "الأصناف", browseCat: "تصفّح الصنف", allCats: "كل الأصناف",
    products: n => `${n} منتج`, soon: "قريباً", featured: "الأكثر طلباً", seeAll: "عرض الكل", byCat: "تصفّح حسب الصنف",
    perks: [["i-truck", "توصيل لـ 58 ولاية", "نوصل طلبك أينما كنت"], ["i-cash", "الدفع عند الاستلام", "ادفع حين تستلم"], ["i-shield", "منتجات مضمونة", "جودة نختارها بعناية"], ["i-tool", "تصليح سريع", "بأيدٍ خبيرة"]],
    whatWe: "ماذا نقدّم؟", repairT: "تصليح الهواتف", flexyT: "فليكسي وخدمات الاتصال", askPrice: "اسأل عن السعر",
    visit: "زورونا", openMap: "افتح الخريطة", call: "اتصل", wa: "واتساب", fb: "فيسبوك",
    search: "ابحث عن منتج…", all: "الكل", sort: "ترتيب", sNew: "الأحدث", sAsc: "السعر: الأقل", sDesc: "السعر: الأعلى", sDef: "المميّز",
    noProducts: "لا توجد منتجات هنا بعد", noProductsP: "اسألنا عبر واتساب، قد يكون المنتج متوفراً في المحل.",
    inStock: "متوفر", outStock: "نفد من المخزون", left: n => `بقي ${n} فقط`, qty: "الكمية", addCart: "أضف إلى السلة", added: "أضيف إلى السلة ✓",
    orderNow: "اطلب الآن — الدفع عند الاستلام", fullName: "الاسم الكامل", phone: "رقم الهاتف", wilaya: "الولاية", chooseW: "اختر الولاية",
    commune: "البلدية", address: "العنوان (اختياري)", note: "ملاحظة (اختياري)", subtotal: "المنتجات", delivery: "التوصيل", total: "المجموع",
    deliveryLater: "يُحدَّد عند التأكيد", confirm: "تأكيد الطلب", orderWa: "اطلب عبر واتساب", sending: "جارٍ الإرسال…",
    errName: "اكتب اسمك", errPhone: "رقم هاتف غير صحيح (مثال 0661234567)", errW: "اختر الولاية", errStock: "الكمية غير متوفرة", errGen: "حدث خطأ، حاول مجدداً أو اطلب عبر واتساب",
    cartEmpty: "سلتك فارغة", cartEmptyP: "اكتشف منتجاتنا وأضف ما يعجبك.", remove: "حذف", checkout: "إتمام الطلب",
    thanks: "شكراً! تم استلام طلبك", thanksP: n => `رقم طلبك #${n}. سنتصل بك قريباً لتأكيده.`, thanksWa: "أكّد عبر واتساب", back: "العودة للمتجر",
    da: "دج", notFound: "الصفحة غير موجودة", days: "أيام العمل", waHello: "السلام عليكم، ",
    waAsk: s => `السلام عليكم، أريد معرفة سعر: ${s}`, waProduct: (n, p) => `السلام عليكم، أريد طلب: ${n} — ${p}`,
    waOrder: id => `السلام عليكم، قمت بالطلب رقم #${id} من الموقع، أرجو التأكيد.`, rights: "جميع الحقوق محفوظة", scroll: "مرّر",
    allA: "كل إكسسوارات هاتفك", allB: "في مكان واحد", allP: "سماعات، ساعات ذكية، مكبرات صوت، شواحن وأكثر — مختارة بعناية في محلنا بغرداية."
  },
  fr: {
    home: "Accueil", shop: "Boutique", cats: "Catégories", services: "Services", contact: "Contact", cart: "Panier",
    heroKick: "Ghardaïa · Livraison 58 wilayas", heroA: "Les accessoires", heroB: "signés El Zaime",
    heroP: "Montres, lunettes, écouteurs, enceintes et tout pour votre téléphone — plus réparation pro et flexy tous opérateurs.",
    shopNow: "Voir la boutique", repair: "Réparation", catKick: "CATÉGORIES", browseCat: "Voir la catégorie", allCats: "Toutes",
    products: n => `${n} produits`, soon: "Bientôt", featured: "Les plus demandés", seeAll: "Tout voir", byCat: "Par catégorie",
    perks: [["i-truck", "Livraison 58 wilayas", "Partout en Algérie"], ["i-cash", "Paiement à la livraison", "Payez à réception"], ["i-shield", "Produits garantis", "Qualité sélectionnée"], ["i-tool", "Réparation rapide", "Mains expertes"]],
    whatWe: "NOS SERVICES", repairT: "Réparation de téléphones", flexyT: "Flexy & télécom", askPrice: "Demander le prix",
    visit: "Venez nous voir", openMap: "Ouvrir la carte", call: "Appeler", wa: "WhatsApp", fb: "Facebook",
    search: "Rechercher un produit…", all: "Tout", sort: "Trier", sNew: "Nouveautés", sAsc: "Prix croissant", sDesc: "Prix décroissant", sDef: "Sélection",
    noProducts: "Aucun produit ici pour l'instant", noProductsP: "Demandez-nous sur WhatsApp, il est peut-être en boutique.",
    inStock: "En stock", outStock: "Rupture de stock", left: n => `Plus que ${n}`, qty: "Quantité", addCart: "Ajouter au panier", added: "Ajouté au panier ✓",
    orderNow: "Commander — paiement à la livraison", fullName: "Nom complet", phone: "Téléphone", wilaya: "Wilaya", chooseW: "Choisir la wilaya",
    commune: "Commune", address: "Adresse (facultatif)", note: "Remarque (facultatif)", subtotal: "Produits", delivery: "Livraison", total: "Total",
    deliveryLater: "Précisée à la confirmation", confirm: "Confirmer la commande", orderWa: "Commander sur WhatsApp", sending: "Envoi…",
    errName: "Indiquez votre nom", errPhone: "Numéro invalide (ex. 0661234567)", errW: "Choisissez la wilaya", errStock: "Quantité indisponible", errGen: "Erreur, réessayez ou commandez sur WhatsApp",
    cartEmpty: "Votre panier est vide", cartEmptyP: "Découvrez nos produits.", remove: "Retirer", checkout: "Finaliser la commande",
    thanks: "Merci ! Commande reçue", thanksP: n => `Commande n° ${n}. Nous vous appelons bientôt pour confirmer.`, thanksWa: "Confirmer sur WhatsApp", back: "Retour à la boutique",
    da: "DA", notFound: "Page introuvable", days: "Jours d'ouverture", waHello: "Bonjour, ",
    waAsk: s => `Bonjour, je voudrais connaître le prix : ${s}`, waProduct: (n, p) => `Bonjour, je souhaite commander : ${n} — ${p}`,
    waOrder: id => `Bonjour, j'ai passé la commande n° ${id} sur le site, merci de confirmer.`, rights: "Tous droits réservés", scroll: "Défiler",
    allA: "Tous vos accessoires", allB: "au même endroit", allP: "Écouteurs, montres connectées, enceintes, chargeurs et plus — sélectionnés dans notre boutique de Ghardaïa."
  }
};
const WILAYAS = [["أدرار","Adrar"],["الشلف","Chlef"],["الأغواط","Laghouat"],["أم البواقي","Oum El Bouaghi"],["باتنة","Batna"],["بجاية","Béjaïa"],["بسكرة","Biskra"],["بشار","Béchar"],["البليدة","Blida"],["البويرة","Bouira"],["تمنراست","Tamanrasset"],["تبسة","Tébessa"],["تلمسان","Tlemcen"],["تيارت","Tiaret"],["تيزي وزو","Tizi Ouzou"],["الجزائر","Alger"],["الجلفة","Djelfa"],["جيجل","Jijel"],["سطيف","Sétif"],["سعيدة","Saïda"],["سكيكدة","Skikda"],["سيدي بلعباس","Sidi Bel Abbès"],["عنابة","Annaba"],["قالمة","Guelma"],["قسنطينة","Constantine"],["المدية","Médéa"],["مستغانم","Mostaganem"],["المسيلة","M'Sila"],["معسكر","Mascara"],["ورقلة","Ouargla"],["وهران","Oran"],["البيض","El Bayadh"],["إليزي","Illizi"],["برج بوعريريج","Bordj Bou Arréridj"],["بومرداس","Boumerdès"],["الطارف","El Tarf"],["تندوف","Tindouf"],["تيسمسيلت","Tissemsilt"],["الوادي","El Oued"],["خنشلة","Khenchela"],["سوق أهراس","Souk Ahras"],["تيبازة","Tipaza"],["ميلة","Mila"],["عين الدفلى","Aïn Defla"],["النعامة","Naâma"],["عين تموشنت","Aïn Témouchent"],["غرداية","Ghardaïa"],["غليزان","Relizane"],["تيميمون","Timimoun"],["برج باجي مختار","Bordj Badji Mokhtar"],["أولاد جلال","Ouled Djellal"],["بني عباس","Béni Abbès"],["عين صالح","In Salah"],["عين قزام","In Guezzam"],["تقرت","Touggourt"],["جانت","Djanet"],["المغير","El M'Ghair"],["المنيعة","El Meniaa"]];
const TINTS = ["#4a0d12", "#4a2a08", "#0c2a3a", "#2a0c3a", "#0c3a24", "#3a0c28", "#3a300c", "#0c1f3a"];

let lang = store.get("lang", "ar");
let L = T[lang];
let SITE = null;
let cart = store.get("cart", []);
let cleanups = [];

const fmt = n => Number(n || 0).toLocaleString(lang === "fr" ? "fr-FR" : "en-US").replace(/ | /g, " ") + " " + L.da;
const nm = o => (lang === "fr" && o.name_fr) ? o.name_fr : o.name_ar;
const ds = o => (lang === "fr" && o.desc_fr) ? o.desc_fr : o.desc_ar;
const S = k => SITE.settings[k] || "";
const intl = p => { const d = String(p || "").replace(/\D/g, ""); return d.startsWith("0") ? "213" + d.slice(1) : d; };
const waLink = text => `https://wa.me/${intl(S("whatsapp") || S("phone"))}?text=${encodeURIComponent(text)}`;
const telLink = () => `tel:${S("phone")}`;
const catById = id => SITE.categories.find(c => c.id === id);
const imgOf = p => p.images && p.images[0];
const isCut = u => /-cut\.(webp|png)(\?|$)/.test(u || "");
/* détecte une image détourée (coins transparents) envoyée depuis l'admin */
function detectCut(img, el) {
  const run = () => {
    try {
      const c = document.createElement("canvas"); c.width = c.height = 16;
      const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0, 16, 16);
      const d = x.getImageData(0, 0, 16, 16).data, a = i => d[i * 4 + 3];
      if (a(0) < 20 && a(15) < 20 && a(240) < 20 && a(255) < 20) el.classList.add("cut");
    } catch {}
  };
  img.complete && img.naturalWidth ? run() : img.addEventListener("load", run, { once: true });
}
function watchCuts(root = document) { $$("img[data-cut]", root).forEach(i => { if (!i.dataset.done) { i.dataset.done = 1; detectCut(i, i.closest(i.dataset.cut)); } }); }
const phBox = w => `<div class="ph">${esc(w || "ELZZAIM")}</div>`;

async function api(path, opts = {}) {
  const r = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opts });
  let j = null; try { j = await r.json(); } catch {}
  if (!r.ok) { const e = new Error((j && j.error) || "http"); e.data = j; throw e; }
  return j;
}
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2300); }

/* ---------------- panier ---------------- */
function saveCart() { store.set("cart", cart); paintCount(); }
function paintCount(pop) {
  const n = cart.reduce((a, i) => a + i.qty, 0), b = $("#cartCount");
  b.hidden = !n; b.textContent = n;
  if (pop) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
}
function addToCart(p, qty = 1) {
  const it = cart.find(i => i.id === p.id);
  const max = p.stock === null || p.stock === undefined ? 20 : p.stock;
  if (it) it.qty = Math.min(it.qty + qty, max); else cart.push({ id: p.id, qty: Math.min(qty, max), name_ar: p.name_ar, name_fr: p.name_fr, price: p.price, image: imgOf(p) || "", stock: p.stock });
  saveCart(); paintCount(true); toast(L.added);
}

/* ---------------- effets 3D ---------------- */
function tilt(el, max = 14) {
  if (reduce || !el) return;
  let raf = 0;
  const base = el.dataset.base || "";
  const shine = el.querySelector(".shine");
  const move = e => {
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) - .5, y = ((e.clientY - r.top) / r.height) - .5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `${base} rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(10px)`;
      if (shine) { shine.style.setProperty("--mx", (x + .5) * 100 + "%"); shine.style.setProperty("--my", (y + .5) * 100 + "%"); }
    });
  };
  const leave = () => { cancelAnimationFrame(raf); el.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)"; el.style.transform = base; setTimeout(() => el.style.transition = "", 800); };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  el.addEventListener("pointercancel", leave);
}
/* parallaxe au défilement + orientation */
let scrollers = [];
let gyro = { x: 0, y: 0 };
function onScroll() {
  const y = scrollY, vh = innerHeight;
  for (const s of scrollers) {
    const r = s.el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    s.fn(y, r, vh);
  }
}
let ticking = false;
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
addEventListener("deviceorientation", e => {
  if (e.gamma == null) return;
  gyro.x = Math.max(-1, Math.min(1, e.gamma / 30)); gyro.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
}, { passive: true });
function scroller(el, fn) { if (reduce || !el) return; scrollers.push({ el, fn }); }

let io;
function reveal(root = app) {
  if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv, .chs", root).forEach(el => io.observe(el));
}
const chars = t => [...t].map((c, i) => `<span class="ch"><i style="transition-delay:${i * 35}ms">${c === " " ? "&nbsp;" : esc(c)}</i></span>`).join("");
const words = t => t.split(" ").map((w, i) => `<span class="ch"><i style="transition-delay:${i * 90}ms">${esc(w)}</i></span>`).join(" ");

/* ---------------- composants ---------------- */
function productCard(p, i = 0) {
  const c = catById(p.category_id), out = p.stock === 0;
  const off = p.old_price && p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
  return `<article class="pc rv d${i % 4}" data-id="${p.id}">
    ${out ? `<span class="tag out">${L.outStock}</span>` : off ? `<span class="tag">-${off}%</span>` : ""}
    <a class="im" href="#/p/${p.id}">${imgOf(p) ? `<img loading="lazy" src="${esc(imgOf(p))}" alt="${esc(nm(p))}">` : phBox(c && c.word)}</a>
    <div class="t"><a href="#/p/${p.id}"><h3>${esc(nm(p))}</h3></a>
      <div class="pr"><div><div class="price">${fmt(p.price)}</div>${p.old_price ? `<div class="old">${fmt(p.old_price)}</div>` : ""}</div>
      ${out ? "" : `<button class="add" data-add="${p.id}" aria-label="${L.addCart}">+</button>`}</div></div></article>`;
}
function bindCards(root, list) {
  $$("[data-add]", root).forEach(b => b.addEventListener("click", e => { e.preventDefault(); const p = list.find(x => x.id === +b.dataset.add); if (p) addToCart(p); }));
  if (matchMedia("(pointer:fine)").matches) $$(".pc", root).forEach(el => tilt(el, 8));
}
function catTile(c, i) {
  return `<a class="cat rv r3 d${i % 4} ${isCut(c.image) ? "cut" : ""}" href="#/shop?cat=${encodeURIComponent(c.slug)}" style="--d:${(i % 5) * -1.3}s">
    <img loading="lazy" src="${esc(c.image)}" alt="" data-cut=".cat"><span class="w">${esc(c.word)}</span>
    <div><h3>${esc(nm(c))}</h3><small>${c.count ? L.products(c.count) : L.soon}</small></div></a>`;
}
function bandHTML(items, cls = "") {
  const s = items.map(w => `<span>${esc(w)} <b>✦</b></span>`).join("");
  return `<div class="band ${cls}"><div class="band-track">${s}${s}</div></div>`;
}
function footerHTML() {
  return `<footer><div class="wrap">
    <div class="foot-links"><a href="#/shop">${L.shop}</a><a href="#/services">${L.services}</a><a href="#/contact">${L.contact}</a>
    ${S("facebook") ? `<a href="${esc(S("facebook"))}" target="_blank" rel="noopener">Facebook</a>` : ""}${S("instagram") ? `<a href="${esc(S("instagram"))}" target="_blank" rel="noopener">Instagram</a>` : ""}${S("tiktok") ? `<a href="${esc(S("tiktok"))}" target="_blank" rel="noopener">TikTok</a>` : ""}</div>
    <p class="mut" style="margin-top:14px;font-size:13px">📍 ${esc(lang === "fr" ? S("city_fr") : S("city_ar"))} · <span class="ltr">${esc(S("phone"))}</span></p>
    <div class="giant grad" aria-hidden="true">ELZZAIM</div>
    <p class="mut" style="font-size:12px">© ${new Date().getFullYear()} Elzzaim Telecom — ${L.rights}</p></div></footer>`;
}

/* ---------------- pages ---------------- */
async function pageHome() {
  const cats = SITE.categories;
  const pick = ["montres", "casques", "lunettes"].map(s => cats.find(c => c.slug === s)).filter(Boolean);
  while (pick.length < 3 && cats[pick.length]) pick.push(cats[pick.length]);
  const im = i => pick[i] ? pick[i].image : "/img/shop.webp";
  const repair = SITE.services.filter(s => s.kind === "repair"), flexy = SITE.services.filter(s => s.kind === "flexy");
  const announce = lang === "fr" ? S("announce_fr") : S("announce_ar");
  const ads = (SITE.settings.ads || []).filter(a => a.active && a.image);

  app.innerHTML = `
  <section class="hero">
    <div class="giant stroke w1" data-par="-.25">ZAIME</div>
    <div class="giant stroke w2" data-par=".18">TELECOM</div>
    <div class="hero-stage stage">
      <div class="c3d hc2 ${isCut(im(1)) ? "cut" : ""}" data-hc="2"><img src="${im(1)}" alt="" data-cut=".c3d"><div class="shine"></div></div>
      <div class="c3d hc3 ${isCut(im(2)) ? "cut" : ""}" data-hc="3"><img src="${im(2)}" alt="" data-cut=".c3d"><div class="shine"></div></div>
      <div class="c3d hc1 ${isCut(im(0)) ? "cut" : ""}" data-hc="1"><img src="${im(0)}" alt="" data-cut=".c3d"><div class="shine"></div></div>
    </div>
    <div class="wrap hero-txt chs">
      ${announce ? `<div class="notice rv" style="margin-bottom:14px">${esc(announce)}</div>` : ""}
      <div class="kick rv">${L.heroKick}</div>
      <h1 class="h1" style="margin-top:6px">${words(L.heroA)}<br><span class="grad">${words(L.heroB)}</span></h1>
      <p class="mut rv d2">${L.heroP}</p>
      <div class="hero-btns rv d3"><a class="btn r" href="#/shop">${L.shopNow} ${ico("i-arrow", "arr")}</a><a class="btn l" href="#/services">${ico("i-tool")} ${L.repair}</a></div>
    </div>
    <div class="scroll-cue" aria-label="${L.scroll}"></div>
  </section>

  ${ads.length ? `<section class="ads" id="ads"><div class="wrap"><div class="stage"><div class="ad-card c3d" id="adCard">
    ${ads.map((a, i) => `<a class="ad-slide ${i ? "" : "on"}" ${a.link ? `href="${esc(a.link)}" ${/^https?:/.test(a.link) ? 'target="_blank" rel="noopener"' : ""}` : ""}><img src="${esc(a.image)}" alt="" ${i ? 'loading="lazy"' : ""}></a>`).join("")}
    <div class="shine"></div></div></div>
    ${ads.length > 1 ? `<div class="dots" id="adDots">${ads.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}</div></section>` : ""}

  <div class="band-wrap" aria-hidden="true">
    ${bandHTML(["GHARDAÏA", ...cats.slice(0, 6).map(c => c.word), "FLEXY"], "b2")}
    ${bandHTML(cats.slice(0, 8).map(c => nm(c)))}
  </div>

  ${cats.length ? `<section class="show" id="show">
    <div class="show-bg"></div>
    <div class="wrap show-top"><div style="display:flex;justify-content:space-between;align-items:center"><span class="kick">${L.catKick}</span><span class="btn l sm" id="showCount"></span></div></div>
    <div class="giant show-word" id="showWord"></div>
    <div class="show-stage stage"><div class="c3d show-card" id="showCard"><img id="showImg" alt=""><div class="shine"></div></div></div>
    <div class="wrap show-txt">
      <h2 class="h2" id="showName"></h2>
      <p class="mut" id="showSub" style="margin:2px 0 16px"></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn r sm" id="showGo">${L.browseCat}</a><a class="btn l sm" href="#/shop">${L.allCats}</a></div>
      <div class="show-ctrl"><button class="circ pv" id="showPrev" aria-label="prev">${ico("i-arrow")}</button><div class="count" id="showIdx"></div><button class="circ nx" id="showNext" aria-label="next">${ico("i-arrow")}</button></div>
    </div></section>` : ""}

  <section class="sec" id="featSec" hidden><div class="wrap">
    <div class="sec-head"><div><div class="kick rv">${L.shop}</div><h2 class="h2 rv d1">${L.featured}</h2></div><a href="#/shop">${L.seeAll} ${ico("i-arrow", "arr")}</a></div>
    <div class="grid" id="feat"></div></div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><div class="kick rv">${L.cats}</div><h2 class="h2 rv d1">${L.byCat}</h2></div></div>
    <div class="cats">${cats.map(catTile).join("")}</div></div></section>

  <section class="sec" style="padding-top:40px"><div class="wrap"><div class="perks">
    ${L.perks.map((p, i) => `<div class="perk rv r3 d${i}">${ico(p[0])}<b>${p[1]}</b><span>${p[2]}</span></div>`).join("")}
  </div></div></section>

  <section class="sec all-in"><div class="wrap">
    <div class="stage"><div class="c3d all-card" id="allCard"><img src="/img/accessoires.webp" alt="" loading="lazy"><div class="shine"></div></div></div>
    <div class="all-txt chs"><div class="kick rv">Elzzaim Telecom</div>
      <h2 class="h2">${words(L.allA)} <span class="grad">${words(L.allB)}</span></h2>
      <p class="mut rv d2" style="margin:8px 0 18px">${L.allP}</p>
      <a class="btn r rv d3" href="#/shop">${L.shopNow} ${ico("i-arrow", "arr")}</a></div>
  </div></section>

  <section class="sec" id="services"><div class="wrap">
    <div class="kick rv">${L.whatWe}</div>
    <div class="svc-cols">
      <div><div class="svc-n rv"><b>01</b><h2 class="h2" style="font-size:clamp(22px,5.5vw,34px)">${L.repairT}</h2></div>
        <div class="glass rv d1">${repair.map(s => `<div class="sv"><span><span class="ico">${esc(s.icon)}</span>${esc(nm(s))}</span><a class="ask" target="_blank" rel="noopener" href="${waLink(L.waAsk(nm(s)))}">${ico("i-wa")}${L.askPrice}</a></div>`).join("")}</div></div>
      <div><div class="svc-n o rv"><b>02</b><h2 class="h2" style="font-size:clamp(22px,5.5vw,34px)">${L.flexyT}</h2></div>
        <div class="flexy">${flexy.map((s, i) => `<a class="fx glass rv r3 d${i % 4}" target="_blank" rel="noopener" href="${waLink(L.waHello + nm(s))}"><span>${esc(s.icon)}</span>${esc(nm(s))}</a>`).join("")}</div></div>
    </div></div></section>

  <section class="sec visit"><div class="wrap visit-grid">
    <div class="stage rv"><div class="c3d" id="shopCard" data-base="rotateX(14deg)" style="background-image:url('/img/shop.webp');transform:rotateX(14deg)"><div class="shine"></div></div></div>
    <div class="glass visit-card rv d1">
      <div class="kick">${L.visit}</div>
      <div class="info">${ico("i-pin")} ${esc(lang === "fr" ? S("city_fr") : S("city_ar"))}</div>
      ${S("days_ar") ? `<div class="info">🗓 ${esc(lang === "fr" ? S("days_fr") : S("days_ar"))}${(lang === "fr" ? S("hours_fr") : S("hours_ar")) ? " · " + esc(lang === "fr" ? S("hours_fr") : S("hours_ar")) : ""}</div>` : ""}
      <div class="info">${ico("i-phone")} <span class="ltr">${esc(S("phone"))}</span></div>
      <div class="acts"><a class="btn wa sm" target="_blank" rel="noopener" href="${waLink(L.waHello)}">${ico("i-wa")} ${L.wa}</a><a class="btn r sm" href="${telLink()}">${ico("i-phone")} ${L.call}</a>
      ${S("maps") ? `<a class="btn l sm" target="_blank" rel="noopener" href="${esc(S("maps"))}">${ico("i-pin")} ${L.openMap}</a>` : ""}</div>
    </div></div></section>
  ${footerHTML()}`;

  /* héros : cartes 3D */
  const hc = $$("[data-hc]");
  const pose = [null, { x: 0, ry: -14, rx: 6, rz: 0, z: 40 }, { x: -1, ry: 30, rx: 4, rz: -7, z: -60 }, { x: 1, ry: -32, rx: 4, rz: 6, z: -70 }];
  const wide = innerWidth >= 760;
  const spread = wide ? 210 : Math.min(innerWidth * .3, 150);
  const setHero = (sy = 0) => hc.forEach(el => {
    const p = pose[el.dataset.hc], k = Math.min(sy / innerHeight, 1.2);
    el.style.transform = `translate3d(${p.x * spread}px, ${(p.x ? 40 : 0) - sy * (.15 + Math.abs(p.x) * .12)}px, ${p.z}px) rotateY(${p.ry + gyro.x * 10 + k * p.x * 25}deg) rotateX(${p.rx - gyro.y * 8 + k * 18}deg) rotateZ(${p.rz}deg)`;
  });
  setHero();
  if (!reduce) hc.forEach((el, i) => { el.style.opacity = 0; el.style.transition = `opacity 1s ${.15 * i}s, transform 1.4s cubic-bezier(.22,1,.36,1) ${.15 * i}s`; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = 1; setTimeout(() => el.style.transition = "", 1700); })); });
  scroller($(".hero"), y => setHero(y));
  $$("[data-par]").forEach(el => scroller(el, y => { el.style.transform = `translateX(${y * +el.dataset.par}px)`; }));
  if (matchMedia("(pointer:fine)").matches) {
    const hero = $(".hero");
    hero.addEventListener("pointermove", e => { gyro.x = (e.clientX / innerWidth - .5) * 2; gyro.y = (e.clientY / innerHeight - .5) * 2; setHero(scrollY); });
  }

  /* vitrine */
  if (cats.length) initShowcase(cats);
  if (ads.length) initAds(ads.length);
  const allCard = $("#allCard");
  tilt(allCard, 10);
  scroller(allCard, (y, r, vh) => { const k = (r.top + r.height / 2 - vh / 2) / vh; allCard.style.transform = `rotateX(${k * 22}deg) rotateY(${gyro.x * 8}deg) scale(${1 - Math.abs(k) * .08})`; allCard.querySelector("img").style.transform = `scale(1.15) translateY(${k * 40}px)`; });
  tilt($("#shopCard"), 10);
  scroller($("#shopCard"), (y, r, vh) => { const k = (r.top + r.height / 2 - vh / 2) / vh; $("#shopCard").style.transform = `rotateX(${14 + k * 20}deg) rotateY(${gyro.x * 6}deg)`; });

  reveal(); watchCuts(app);
  /* produits vedettes */
  try {
    let list = await api("/api/products?featured=1&limit=8");
    if (list.length < 4) list = await api("/api/products?limit=8");
    if (list.length) { $("#featSec").hidden = false; const g = $("#feat"); g.innerHTML = list.map(productCard).join(""); bindCards(g, list); reveal(g); }
  } catch {}
}

function initAds(n) {
  const card = $("#adCard"), slides = $$(".ad-slide", card), dots = $$("#adDots i");
  let i = 0, timer;
  const show = k => { i = (k + n) % n; slides.forEach((s, j) => s.classList.toggle("on", j === i)); dots.forEach((d, j) => d.classList.toggle("on", j === i)); };
  const auto = () => { clearInterval(timer); if (n > 1) timer = setInterval(() => { if (document.visibilityState === "visible") show(i + 1); }, 5000); };
  auto(); tilt(card, 10);
  let sx = null;
  card.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  card.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { show(i + ((dx < 0) === (lang === "ar") ? -1 : 1)); auto(); } sx = null; });
  scroller(card, (y, r, vh) => { const k = (r.top + r.height / 2 - vh / 2) / vh; card.style.transform = `rotateX(${k * 18}deg) rotateY(${gyro.x * 8}deg)`; });
  cleanups.push(() => clearInterval(timer));
}

function initShowcase(cats) {
  const sec = $("#show"); let i = 0, busy = false, timer;
  const paint = () => {
    const c = cats[i];
    sec.style.setProperty("--sc", TINTS[i % TINTS.length]);
    $("#showWord").textContent = c.word || "";
    $("#showWord").style.fontSize = `min(${Math.min(36, 160 / Math.max((c.word || "").length, 3))}vw, 380px)`;
    $("#showImg").src = c.image;
    $("#showCard").classList.toggle("cut", isCut(c.image));
    if (!isCut(c.image)) detectCut($("#showImg"), $("#showCard"));
    $("#showName").textContent = nm(c);
    $("#showSub").textContent = c.count ? L.products(c.count) : L.soon;
    $("#showCount").textContent = L.products(SITE.productCount);
    $("#showGo").href = `#/shop?cat=${encodeURIComponent(c.slug)}`;
    $("#showIdx").innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b> / ${String(cats.length).padStart(2, "0")}`;
  };
  const go = d => {
    if (busy) return; busy = true;
    sec.classList.add("out");
    setTimeout(() => { i = (i + d + cats.length) % cats.length; paint(); sec.classList.remove("out"); setTimeout(() => busy = false, 500); }, reduce ? 0 : 480);
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => { if (document.visibilityState === "visible") go(1); }, 4200); };
  paint(); auto();
  $("#showNext").onclick = () => { go(1); auto(); };
  $("#showPrev").onclick = () => { go(-1); auto(); };
  let sx = null;
  sec.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  sec.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go(dx < 0 === (lang === "ar") ? -1 : 1); auto(); } sx = null; });
  const card = $("#showCard");
  scroller(sec, (y, r, vh) => {
    const k = (r.top) / vh;
    card.style.transform = `rotateY(${-16 + k * 30 + gyro.x * 12}deg) rotateX(${8 - k * 14 - gyro.y * 8}deg) rotateZ(${3 - k * 4}deg)`;
    $("#showWord").style.transform = `translateY(${k * 60}px)`;
  });
  onScroll();
  tilt(card, 16);
  cleanups.push(() => clearInterval(timer));
}

async function pageShop(params) {
  const cats = SITE.categories;
  let cat = params.get("cat") || "", qv = params.get("q") || "", sort = params.get("sort") || "";
  const c = cats.find(x => x.slug === cat);
  app.innerHTML = `<section class="page"><div class="wrap">
    <div class="pg-title"><div class="giant stroke" aria-hidden="true">${esc(c ? c.word : "SHOP")}</div><div class="kick">${L.shop}</div><h1 class="h2">${esc(c ? nm(c) : L.shop)}</h1></div>
    <label class="search">${ico("i-search")}<input id="q" type="search" placeholder="${L.search}" value="${esc(qv)}" enterkeyhint="search"></label>
    <div class="chips" id="chips"><a class="chip ${!cat ? "on" : ""}" href="#/shop">${L.all}</a>${cats.map(x => `<a class="chip ${x.slug === cat ? "on" : ""}" href="#/shop?cat=${encodeURIComponent(x.slug)}">${esc(nm(x))}</a>`).join("")}</div>
    <div class="tools"><span id="cnt"></span><select class="sel" id="sort" aria-label="${L.sort}">
      <option value="">${L.sDef}</option><option value="new">${L.sNew}</option><option value="price_asc">${L.sAsc}</option><option value="price_desc">${L.sDesc}</option></select></div>
    <div class="grid" id="grid">${Array.from({ length: 6 }, () => `<div class="skel" style="aspect-ratio:.72"></div>`).join("")}</div>
  </div></section>${footerHTML()}`;
  $("#sort").value = sort;
  const on = $(".chip.on"); if (on) on.scrollIntoView({ inline: "center", block: "nearest" });
  const load = async () => {
    const u = new URLSearchParams(); if (cat) u.set("cat", cat); if (qv) u.set("q", qv); if (sort) u.set("sort", sort);
    const list = await api("/api/products?" + u).catch(() => []);
    const g = $("#grid"); if (!g) return;
    $("#cnt").textContent = L.products(list.length);
    g.innerHTML = list.length ? list.map(productCard).join("") : `<div class="empty" style="grid-column:1/-1"><div class="giant">${esc(c ? c.word : "SOON")}</div><b>${L.noProducts}</b><p>${L.noProductsP}</p><a class="btn wa sm" style="margin-top:16px" target="_blank" rel="noopener" href="${waLink(L.waHello + (c ? nm(c) : ""))}">${ico("i-wa")} ${L.wa}</a></div>`;
    bindCards(g, list); reveal(g);
  };
  let t;
  $("#q").addEventListener("input", e => { clearTimeout(t); t = setTimeout(() => { qv = e.target.value.trim(); history.replaceState(null, "", "#/shop?" + new URLSearchParams({ ...(cat && { cat }), ...(qv && { q: qv }), ...(sort && { sort }) })); load(); }, 300); });
  $("#sort").addEventListener("change", e => { sort = e.target.value; load(); });
  load();
}

function orderForm(prefix = "") {
  return `<form class="glass form" id="orderForm" novalidate>
    <h3>📝 ${L.orderNow}</h3>
    <input class="hp" name="website" tabindex="-1" autocomplete="off">
    <label for="f_name">${L.fullName}</label><input class="in" id="f_name" name="name" autocomplete="name" required>
    <label for="f_phone">${L.phone}</label><input class="in ltr" id="f_phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 XX XX XX XX" style="text-align:start" required>
    <div class="row2"><div><label for="f_w">${L.wilaya}</label><select class="in" id="f_w" name="wilaya" required><option value="">${L.chooseW}</option>
      ${WILAYAS.map((w, i) => `<option value="${String(i + 1).padStart(2, "0")} - ${esc(w[lang === "fr" ? 1 : 0])}">${String(i + 1).padStart(2, "0")} - ${esc(w[lang === "fr" ? 1 : 0])}</option>`).join("")}</select></div>
      <div><label for="f_c">${L.commune}</label><input class="in" id="f_c" name="commune"></div></div>
    <label for="f_a">${L.address}</label><input class="in" id="f_a" name="address" autocomplete="street-address">
    <label for="f_n">${L.note}</label><textarea class="in" id="f_n" name="note"></textarea>
    <div style="margin-top:14px" id="totals"></div>
    <button class="btn r full" style="margin-top:12px" type="submit" id="submitBtn">${L.confirm}</button>
    <a class="btn wa full" style="margin-top:10px" target="_blank" rel="noopener" id="waOrder">${ico("i-wa")} ${L.orderWa}</a>
  </form>`;
}
function deliveryFor(w) {
  const d = SITE.settings.delivery || {};
  if (!d.enabled) return null;
  if (!w) return undefined;
  const code = String(parseInt(w, 10));
  const v = d.prices && d.prices[code];
  return v !== undefined ? +v : +(d.default_price || 0);
}
function bindOrderForm(getItems, waText) {
  const f = $("#orderForm"); if (!f) return;
  const saved = store.get("cust", {});
  ["name", "phone", "wilaya", "commune", "address"].forEach(k => { if (saved[k] && f[k]) f[k].value = saved[k]; });
  const paintTot = () => {
    const items = getItems(), sub = items.reduce((a, i) => a + i.price * i.qty, 0);
    const dv = deliveryFor(f.wilaya.value);
    $("#totals").innerHTML = `<div class="tot"><span>${L.subtotal}</span><span>${fmt(sub)}</span></div>
      <div class="tot"><span>${L.delivery}</span><span class="mut">${dv === null || dv === undefined ? L.deliveryLater : dv === 0 ? "0 " + L.da : fmt(dv)}</span></div>
      <div class="tot big"><span>${L.total}</span><b>${fmt(sub + (dv || 0))}</b></div>`;
    $("#waOrder").href = waLink(waText());
  };
  paintTot();
  f.wilaya.addEventListener("change", paintTot);
  f.addEventListener("input", () => { $("#waOrder").href = waLink(waText()); });
  f.addEventListener("submit", async e => {
    e.preventDefault();
    $$(".in", f).forEach(i => i.classList.remove("err"));
    const v = Object.fromEntries(new FormData(f));
    const phone = (v.phone || "").replace(/[\s.-]/g, "");
    let bad = null;
    if ((v.name || "").trim().length < 2) bad = ["name", L.errName];
    else if (!/^0[5-7]\d{8}$/.test(phone)) bad = ["phone", L.errPhone];
    else if (!v.wilaya) bad = ["wilaya", L.errW];
    if (bad) { f[bad[0]].classList.add("err"); f[bad[0]].focus(); toast(bad[1]); return; }
    const btn = $("#submitBtn"); btn.disabled = true; btn.textContent = L.sending;
    store.set("cust", { name: v.name, phone, wilaya: v.wilaya, commune: v.commune, address: v.address });
    try {
      const r = await api("/api/orders", { method: "POST", body: JSON.stringify({ ...v, phone, lang, items: getItems().map(i => ({ id: i.id, qty: i.qty })) }) });
      if (f.dataset.cart) { cart = []; saveCart(); }
      location.hash = `#/thanks/${r.id}`;
    } catch (err) {
      btn.disabled = false; btn.textContent = L.confirm;
      toast(err.message === "stock" ? L.errStock : err.message === "phone" ? L.errPhone : L.errGen);
    }
  });
}

async function pageProduct(id) {
  app.innerHTML = `<section class="page"><div class="wrap"><div class="skel" style="height:55svh"></div></div></section>`;
  let p; try { p = await api("/api/products/" + id); } catch { return pageNotFound(); }
  const c = catById(p.category_id), imgs = p.images.length ? p.images : [null];
  const out = p.stock === 0;
  let qty = 1, gi = 0;
  app.innerHTML = `<section class="page"><div class="wrap pd-grid">
    <div>
      <div class="pd-stage stage">
        <div class="giant stroke" aria-hidden="true">${esc(c ? c.word : "ZAIME")}</div>
        <div class="c3d pd-card float" id="pdCard">${imgs[0] ? `<img id="pdImg" src="${esc(imgs[0])}" alt="${esc(nm(p))}">` : phBox(c && c.word)}<div class="shine"></div></div>
      </div>
      ${imgs.length > 1 ? `<div class="dots" id="dots">${imgs.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}
    </div>
    <div class="rv vis">
      ${c ? `<a class="kick" href="#/shop?cat=${encodeURIComponent(c.slug)}">${esc(nm(c))}</a>` : ""}
      <h1 class="pd-title">${esc(nm(p))}</h1>
      <div class="pd-price"><span class="price">${fmt(p.price)}</span>${p.old_price ? `<span class="old">${fmt(p.old_price)}</span>` : ""}
        <span class="stock ${out ? "no" : ""}">${out ? L.outStock : p.stock !== null && p.stock <= 3 ? L.left(p.stock) : L.inStock}</span></div>
      ${ds(p) ? `<p class="desc">${esc(ds(p))}</p>` : ""}
      ${out ? `<a class="btn wa full" style="margin-top:16px" target="_blank" rel="noopener" href="${waLink(L.waAsk(nm(p)))}">${ico("i-wa")} ${L.wa}</a>` : `
      <div style="display:flex;gap:10px;align-items:center;margin-top:14px">
        <div class="qty"><button type="button" id="qm">−</button><span id="qv">1</span><button type="button" id="qp">+</button></div>
        <button class="btn l" style="flex:1" id="addBtn">${ico("i-cart")} ${L.addCart}</button></div>
      ${orderForm()}`}
    </div></div></section>${footerHTML()}`;
  const card = $("#pdCard"); tilt(card, 18);
  scroller(card, (y, r, vh) => { const k = (r.top + r.height / 2 - vh / 2) / vh; card.style.transform = `rotateX(${k * -25 - gyro.y * 8}deg) rotateY(${gyro.x * 14}deg)`; });
  onScroll();
  if (imgs.length > 1) {
    const show = n => { gi = (n + imgs.length) % imgs.length; $("#pdImg").src = imgs[gi]; $$("#dots i").forEach((d, i) => d.classList.toggle("on", i === gi)); };
    let sx = null;
    card.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
    card.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(gi + (dx < 0 ? 1 : -1)); else show(gi + 1); sx = null; });
    card.addEventListener("click", e => { if (e.pointerType === "mouse") show(gi + 1); });
  }
  if (out) return;
  const max = p.stock === null ? 20 : p.stock;
  const items = () => [{ id: p.id, qty, price: p.price }];
  const waText = () => L.waProduct(nm(p), `${qty} × ${fmt(p.price)}`);
  const setQ = n => { qty = Math.max(1, Math.min(n, max)); $("#qv").textContent = qty; bindTot(); };
  let bindTot = () => {};
  $("#qm").onclick = () => setQ(qty - 1); $("#qp").onclick = () => setQ(qty + 1);
  $("#addBtn").onclick = () => addToCart(p, qty);
  bindOrderForm(items, waText);
  bindTot = () => $("#orderForm").wilaya.dispatchEvent(new Event("change"));
}

function pageCart() {
  if (!cart.length) {
    app.innerHTML = `<section class="page"><div class="wrap empty"><div class="giant">EMPTY</div><h1 class="h2">${L.cartEmpty}</h1><p>${L.cartEmptyP}</p><a class="btn r" style="margin-top:18px" href="#/shop">${L.shopNow}</a></div></section>`;
    return;
  }
  app.innerHTML = `<section class="page"><div class="wrap">
    <div class="pg-title"><div class="giant stroke" aria-hidden="true">CART</div><div class="kick">${L.cart}</div><h1 class="h2">${L.checkout}</h1></div>
    <div class="cart-grid"><div class="glass" id="items"></div><div>${orderForm()}</div></div></div></section>`;
  $("#orderForm").dataset.cart = "1";
  const paint = () => {
    $("#items").innerHTML = cart.map(i => `<div class="ci" data-id="${i.id}">
      <div class="im">${i.image ? `<img src="${esc(i.image)}" alt="">` : phBox("EZ")}</div>
      <div style="flex:1;min-width:0"><h4>${esc(nm(i))}</h4><div class="price" style="font-size:14px">${fmt(i.price)}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><div class="qty"><button data-d="-1">−</button><span>${i.qty}</span><button data-d="1">+</button></div><button class="rm" data-rm>${L.remove}</button></div></div></div>`).join("");
    $$(".ci").forEach(row => {
      const it = cart.find(x => x.id === +row.dataset.id);
      $$("[data-d]", row).forEach(b => b.onclick = () => { const max = it.stock === null || it.stock === undefined ? 20 : it.stock; it.qty = Math.max(1, Math.min(it.qty + +b.dataset.d, max)); saveCart(); paint(); });
      $("[data-rm]", row).onclick = () => { cart = cart.filter(x => x !== it); saveCart(); cart.length ? paint() : pageCart(); };
    });
    const f = $("#orderForm"); if (f) f.wilaya.dispatchEvent(new Event("change"));
  };
  bindOrderForm(() => cart, () => L.waHello + "\n" + cart.map(i => `• ${nm(i)} × ${i.qty} = ${fmt(i.price * i.qty)}`).join("\n") + `\n${L.total}: ${fmt(cart.reduce((a, i) => a + i.price * i.qty, 0))}`);
  paint();
}

function pageThanks(id) {
  app.innerHTML = `<section class="page"><div class="wrap done">
    <div class="check">✓</div><h1 class="h2">${L.thanks}</h1><p class="mut">${L.thanksP(esc(id))}</p>
    <a class="btn wa" target="_blank" rel="noopener" href="${waLink(L.waOrder(id))}">${ico("i-wa")} ${L.thanksWa}</a>
    <a class="btn l" href="#/shop">${L.back}</a></div></section>`;
}

function pageServices() {
  const repair = SITE.services.filter(s => s.kind === "repair"), flexy = SITE.services.filter(s => s.kind === "flexy");
  app.innerHTML = `<section class="page"><div class="wrap">
    <div class="pg-title"><div class="giant stroke" aria-hidden="true">FIX</div><div class="kick">${L.whatWe}</div><h1 class="h2">${L.services}</h1></div>
    <div class="svc-cols">
    <div><div class="svc-n rv"><b>01</b><h2 class="h2" style="font-size:clamp(22px,5.5vw,34px)">${L.repairT}</h2></div>
    <div class="glass rv">${repair.map(s => `<div class="sv"><span><span class="ico">${esc(s.icon)}</span>${esc(nm(s))}</span><a class="ask" target="_blank" rel="noopener" href="${waLink(L.waAsk(nm(s)))}">${ico("i-wa")}${L.askPrice}</a></div>`).join("")}</div></div>
    <div><div class="svc-n o rv"><b>02</b><h2 class="h2" style="font-size:clamp(22px,5.5vw,34px)">${L.flexyT}</h2></div>
    <div class="flexy">${flexy.map((s, i) => `<a class="fx glass rv r3 d${i % 4}" target="_blank" rel="noopener" href="${waLink(L.waHello + nm(s))}"><span>${esc(s.icon)}</span>${esc(nm(s))}</a>`).join("")}</div></div></div>
    <div class="acts" style="margin-top:26px"><a class="btn wa" target="_blank" rel="noopener" href="${waLink(L.waHello)}">${ico("i-wa")} ${L.wa}</a><a class="btn r" href="${telLink()}">${ico("i-phone")} ${L.call}</a></div>
  </div></section>${footerHTML()}`;
  reveal();
}

function pageContact() {
  const lat = SITE.settings.lat, lng = SITE.settings.lng;
  const hours = lang === "fr" ? S("hours_fr") : S("hours_ar");
  app.innerHTML = `<section class="page"><div class="wrap">
    <div class="pg-title"><div class="giant stroke" aria-hidden="true">HELLO</div><div class="kick">${L.contact}</div><h1 class="h2">${L.visit}</h1></div>
    <div class="visit-grid">
      <div class="stage"><div class="c3d" id="sc" data-base="rotateX(10deg)" style="aspect-ratio:16/10;background-image:url('/img/sign.webp');transform:rotateX(10deg)"><div class="shine"></div></div></div>
      <div class="glass" style="padding:18px;margin-top:16px">
        <div class="info">${ico("i-pin")} ${esc(lang === "fr" ? S("city_fr") : S("city_ar"))}</div>
        <div class="info">🗓 ${esc(lang === "fr" ? S("days_fr") : S("days_ar"))}${hours ? " · " + esc(hours) : ""}</div>
        <div class="info">${ico("i-phone")} <a class="ltr" href="${telLink()}">${esc(S("phone"))}</a></div>
        <div class="acts"><a class="btn wa sm" target="_blank" rel="noopener" href="${waLink(L.waHello)}">${ico("i-wa")} ${L.wa}</a><a class="btn r sm" href="${telLink()}">${ico("i-phone")} ${L.call}</a>
        ${S("facebook") ? `<a class="btn fb sm" target="_blank" rel="noopener" href="${esc(S("facebook"))}">${ico("i-fb")} ${L.fb}</a>` : ""}</div>
      </div></div>
    ${lat && lng ? `<iframe class="map rv" style="margin-top:22px" loading="lazy" title="map" src="https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed"></iframe>` : ""}
    ${S("maps") ? `<a class="btn l full" style="margin-top:12px" target="_blank" rel="noopener" href="${esc(S("maps"))}">${ico("i-pin")} ${L.openMap}</a>` : ""}
  </div></section>${footerHTML()}`;
  tilt($("#sc"), 10); reveal();
}
function pageNotFound() {
  app.innerHTML = `<section class="page"><div class="wrap empty"><div class="giant">404</div><h1 class="h2">${L.notFound}</h1><a class="btn r" style="margin-top:16px" href="#/">${L.home}</a></div></section>`;
}

/* ---------------- routeur ---------------- */
function route() {
  cleanups.forEach(f => f()); cleanups = []; scrollers = [];
  const h = location.hash.replace(/^#/, "") || "/";
  const [p, qs] = h.split("?");
  const params = new URLSearchParams(qs || "");
  const parts = p.split("/").filter(Boolean);
  closeMenu();
  scrollTo({ top: 0, behavior: "instant" });
  paintNav(parts[0] || "");
  if (!parts.length) pageHome();
  else if (parts[0] === "shop") pageShop(params);
  else if (parts[0] === "p" && parts[1]) pageProduct(+parts[1]);
  else if (parts[0] === "cart") pageCart();
  else if (parts[0] === "thanks") pageThanks(parts[1] || "");
  else if (parts[0] === "services") pageServices();
  else if (parts[0] === "contact") pageContact();
  else pageNotFound();
  app.focus({ preventScroll: true });
}

/* ---------------- menu / langue ---------------- */
const drawer = $("#drawer");
function openMenu() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
function closeMenu() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
function paintNav(cur) {
  const links = [["", L.home], ["shop", L.shop], ["services", L.services], ["contact", L.contact], ["cart", L.cart]];
  $("#drawerLinks").innerHTML = links.map(([k, t], i) => `<a href="#/${k}" class="${cur === k ? "on" : ""}" style="transition-delay:${.15 + i * .06}s"><small>0${i + 1}</small>${t}</a>`).join("");
  $("#drawerFoot").innerHTML = `<a class="btn wa sm" target="_blank" rel="noopener" href="${waLink(L.waHello)}">${ico("i-wa")} ${L.wa}</a><a class="btn r sm" href="${telLink()}">${ico("i-phone")} ${L.call}</a>${S("facebook") ? `<a class="btn fb sm" target="_blank" rel="noopener" href="${esc(S("facebook"))}">${ico("i-fb")}</a>` : ""}`;
}
function applyLang() {
  L = T[lang];
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $("#langBtn").textContent = lang === "ar" ? "FR" : "ع";
  document.title = lang === "ar" ? "Elzzaim Telecom — الزعيم تيليكوم | غرداية" : "Elzzaim Telecom — Accessoires & réparation | Ghardaïa";
  if (SITE) $("#fab").href = waLink(L.waHello);
}
$("#menuBtn").onclick = openMenu; $("#menuClose").onclick = closeMenu;
addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
$("#langBtn").onclick = () => { lang = lang === "ar" ? "fr" : "ar"; store.set("lang", lang); applyLang(); route(); };

/* barre qui se cache au défilement */
let lastY = 0;
addEventListener("scroll", () => { const y = scrollY; $("#bar").classList.toggle("hide", y > lastY && y > 300); lastY = y; }, { passive: true });

/* ---------------- démarrage ---------------- */
(async function boot() {
  applyLang(); paintCount();
  try { SITE = await api("/api/site"); }
  catch { app.innerHTML = `<div class="page wrap empty"><div class="giant">OFFLINE</div><p>${L.errGen}</p><button class="btn r" onclick="location.reload()">↻</button></div>`; return; }
  applyLang();
  addEventListener("hashchange", route);
  route();
})();
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
})();
