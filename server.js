"use strict";
/* Elzzaim Telecom — boutique en ligne : API + fichiers statiques */
const express = require("express");
const compression = require("compression");
const crypto = require("crypto");
const path = require("path");
const { Pool } = require("pg");

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "elzzaim2026";
const SECRET = process.env.SESSION_SECRET || crypto.createHash("sha256").update("elz:" + (DATABASE_URL || "dev")).digest("hex");

if (!DATABASE_URL) { console.error("DATABASE_URL manquant"); process.exit(1); }
const pool = new Pool({ connectionString: DATABASE_URL, max: 5, ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false } });
const q = (text, params) => pool.query(text, params);

/* ---------------- schéma + données initiales ---------------- */
const DEFAULT_SETTINGS = {
  shop_name: "Elzzaim Telecom",
  phone: "0668069475",
  whatsapp: "0668069475",
  facebook: "https://www.facebook.com/share/1LYKz1GHYv/",
  instagram: "", tiktok: "",
  maps: "https://maps.app.goo.gl/kvmUv6z6fCfoRnUs5",
  lat: 32.4821586, lng: 3.680368,
  city_ar: "غرداية", city_fr: "Ghardaïa",
  days_ar: "من السبت إلى الخميس", days_fr: "Du samedi au jeudi",
  hours_ar: "", hours_fr: "",
  announce_ar: "", announce_fr: "",
  delivery: { enabled: false, default_price: 0, prices: {} },
  ads: []
};

const SEED_CATS = [
  ["montres", "ساعات", "Montres", "TIME"],
  ["lunettes", "نظارات شمسية", "Lunettes de soleil", "SUN"],
  ["optique", "نظارات طبية", "Montures optiques", "OPTIC"],
  ["audio", "مكبرات صوت", "Haut-parleurs", "AUDIO"],
  ["casques", "سماعات رأس", "Casques", "SOUND"],
  ["ecouteurs", "سماعات أذن", "Écouteurs", "BUDS"],
  ["smart", "ساعات ذكية", "Montres connectées", "SMART"],
  ["radio", "راديو", "Radios", "RADIO"],
  ["coques", "كفرات وحماية", "Coques & protection", "CASE"],
  ["telephones", "هواتف عادية", "Téléphones simples", "PHONE"],
  ["telecommandes", "أجهزة تحكم", "Télécommandes", "REMOTE"],
  ["deco", "ديكور وإضاءة", "Déco & lumières", "GALAXY"],
  ["beaute", "أجهزة العناية", "Soin & beauté", "STYLE"],
  ["cadeaux", "هدايا وميداليات", "Cadeaux & porte-clés", "GIFT"]
];
const SEED_SERVICES = [
  ["repair", "📱", "تغيير الشاشة", "Changement d'écran"],
  ["repair", "🔋", "تغيير البطارية", "Changement de batterie"],
  ["repair", "🔌", "إصلاح مدخل الشحن", "Connecteur de charge"],
  ["repair", "🔊", "إصلاح الصوت والميكروفون", "Son et micro"],
  ["repair", "💻", "برمجة وفك القفل", "Logiciel et déblocage"],
  ["repair", "💧", "علاج الهواتف المبللة", "Téléphone mouillé"],
  ["flexy", "🔴", "Djezzy", "Djezzy"],
  ["flexy", "🟠", "Ooredoo", "Ooredoo"],
  ["flexy", "🟢", "Mobilis", "Mobilis"],
  ["flexy", "📶", "بطاقات الإنترنت والشرائح", "Cartes internet et puces"]
];

async function migrate() {
  await q(`
  CREATE TABLE IF NOT EXISTS settings (id int PRIMARY KEY DEFAULT 1, data jsonb NOT NULL, admin_hash text);
  CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY, slug text UNIQUE NOT NULL, name_ar text NOT NULL, name_fr text NOT NULL,
    word text NOT NULL DEFAULT '', image text NOT NULL DEFAULT '', sort int NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true);
  CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY, category_id int REFERENCES categories(id) ON DELETE SET NULL,
    name_ar text NOT NULL, name_fr text NOT NULL DEFAULT '', desc_ar text NOT NULL DEFAULT '', desc_fr text NOT NULL DEFAULT '',
    price int NOT NULL DEFAULT 0, old_price int, stock int, images text[] NOT NULL DEFAULT '{}',
    active boolean NOT NULL DEFAULT true, featured boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE IF NOT EXISTS images (id serial PRIMARY KEY, mime text NOT NULL, data bytea NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE IF NOT EXISTS services (
    id serial PRIMARY KEY, kind text NOT NULL, icon text NOT NULL DEFAULT '', name_ar text NOT NULL, name_fr text NOT NULL DEFAULT '',
    sort int NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true);
  CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), name text NOT NULL, phone text NOT NULL,
    wilaya text NOT NULL, commune text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '', note text NOT NULL DEFAULT '',
    items jsonb NOT NULL, subtotal int NOT NULL, delivery int NOT NULL DEFAULT 0, total int NOT NULL,
    status text NOT NULL DEFAULT 'new', lang text NOT NULL DEFAULT 'ar');
  CREATE INDEX IF NOT EXISTS products_cat ON products(category_id);
  CREATE INDEX IF NOT EXISTS orders_created ON orders(created_at DESC);`);
  await q(`INSERT INTO settings (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING`, [DEFAULT_SETTINGS]);
  const { rows } = await q(`SELECT count(*)::int n FROM categories`);
  if (rows[0].n === 0) {
    for (const [i, c] of SEED_CATS.entries())
      await q(`INSERT INTO categories (slug,name_ar,name_fr,word,image,sort) VALUES ($1,$2,$3,$4,$5,$6)`, [c[0], c[1], c[2], c[3], `/img/cat/${c[0]}.webp`, i]);
  }
  const s = await q(`SELECT count(*)::int n FROM services`);
  if (s.rows[0].n === 0) {
    for (const [i, v] of SEED_SERVICES.entries())
      await q(`INSERT INTO services (kind,icon,name_ar,name_fr,sort) VALUES ($1,$2,$3,$4,$5)`, [v[0], v[1], v[2], v[3], i]);
  }
}

/* ---------------- utilitaires ---------------- */
const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(compression());
app.use(express.json({ limit: "4mb" }));

const int = (v, d = null) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : d; };
const str = (v, max = 500) => String(v ?? "").trim().slice(0, max);
const wrap = fn => (req, res) => fn(req, res).catch(e => { console.error(e); res.status(500).json({ error: "server" }); });

async function getSettings() { const { rows } = await q(`SELECT data, admin_hash FROM settings WHERE id=1`); return rows[0]; }

function hashPw(pw, salt = crypto.randomBytes(16).toString("hex")) {
  return salt + ":" + crypto.scryptSync(pw, salt, 32).toString("hex");
}
function checkPw(pw, stored) {
  const [salt, h] = stored.split(":");
  const a = Buffer.from(crypto.scryptSync(pw, salt, 32).toString("hex")), b = Buffer.from(h);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function sign(payload) { return crypto.createHmac("sha256", SECRET).update(payload).digest("hex"); }
function makeToken() { const exp = Date.now() + 1000 * 60 * 60 * 24 * 30; const p = `admin.${exp}`; return `${p}.${sign(p)}`; }
function validToken(t) {
  if (!t) return false;
  const i = t.lastIndexOf("."); if (i < 0) return false;
  const p = t.slice(0, i), sig = t.slice(i + 1), exp = +p.split(".")[1];
  const good = sign(p);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)) && exp > Date.now();
}
function auth(req, res, next) {
  const h = req.headers.authorization || "";
  if (validToken(h.replace(/^Bearer\s+/, ""))) return next();
  res.status(401).json({ error: "auth" });
}

/* limiteur simple en mémoire */
const hits = new Map();
function limit(key, max, windowMs) {
  const now = Date.now(), arr = (hits.get(key) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  return arr.length <= max;
}

/* ---------------- API publique ---------------- */
app.get("/api/site", wrap(async (req, res) => {
  const s = await getSettings();
  const cats = await q(`SELECT c.id,c.slug,c.name_ar,c.name_fr,c.word,c.image,
      (SELECT count(*)::int FROM products p WHERE p.category_id=c.id AND p.active) AS count
    FROM categories c WHERE c.active ORDER BY c.sort, c.id`);
  const srv = await q(`SELECT id,kind,icon,name_ar,name_fr FROM services WHERE active ORDER BY sort,id`);
  const total = await q(`SELECT count(*)::int n FROM products WHERE active`);
  res.set("Cache-Control", "no-cache");
  res.json({ settings: s.data, categories: cats.rows, services: srv.rows, productCount: total.rows[0].n });
}));

const PUB_COLS = `id,category_id,name_ar,name_fr,desc_ar,desc_fr,price,old_price,stock,images,featured`;
app.get("/api/products", wrap(async (req, res) => {
  const where = ["active"], params = [];
  if (req.query.cat) { params.push(str(req.query.cat, 60)); where.push(`category_id=(SELECT id FROM categories WHERE slug=$${params.length})`); }
  if (req.query.q) { params.push("%" + str(req.query.q, 60) + "%"); where.push(`(name_ar ILIKE $${params.length} OR name_fr ILIKE $${params.length})`); }
  if (req.query.featured) where.push("featured");
  let order = "featured DESC, created_at DESC";
  if (req.query.sort === "price_asc") order = "price ASC";
  if (req.query.sort === "price_desc") order = "price DESC";
  if (req.query.sort === "new") order = "created_at DESC";
  const lim = Math.min(int(req.query.limit, 200), 500);
  const { rows } = await q(`SELECT ${PUB_COLS} FROM products WHERE ${where.join(" AND ")} ORDER BY ${order} LIMIT ${lim}`, params);
  res.json(rows);
}));

app.get("/api/products/:id", wrap(async (req, res) => {
  const { rows } = await q(`SELECT ${PUB_COLS} FROM products WHERE id=$1 AND active`, [int(req.params.id, 0)]);
  if (!rows[0]) return res.status(404).json({ error: "notfound" });
  res.json(rows[0]);
}));

app.post("/api/orders", wrap(async (req, res) => {
  const ip = req.ip || "x";
  if (!limit("o:" + ip, 8, 10 * 60 * 1000)) return res.status(429).json({ error: "too_many" });
  const b = req.body || {};
  const name = str(b.name, 80), phone = str(b.phone, 20).replace(/[\s.-]/g, ""), wilaya = str(b.wilaya, 40);
  if (name.length < 2) return res.status(400).json({ error: "name" });
  if (!/^0[5-7]\d{8}$/.test(phone)) return res.status(400).json({ error: "phone" });
  if (!wilaya) return res.status(400).json({ error: "wilaya" });
  if (str(b.website)) return res.json({ ok: true, id: 0 }); // piège anti-robot
  const want = (Array.isArray(b.items) ? b.items : []).slice(0, 30)
    .map(i => ({ id: int(i.id, 0), qty: Math.max(1, Math.min(int(i.qty, 1), 20)) })).filter(i => i.id > 0);
  if (!want.length) return res.status(400).json({ error: "items" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: prods } = await client.query(`SELECT id,name_ar,name_fr,price,stock,images FROM products WHERE id = ANY($1) AND active FOR UPDATE`, [want.map(i => i.id)]);
    const items = []; let subtotal = 0;
    for (const w of want) {
      const p = prods.find(x => x.id === w.id);
      if (!p) { await client.query("ROLLBACK"); return res.status(400).json({ error: "gone", id: w.id }); }
      if (p.stock !== null && p.stock < w.qty) { await client.query("ROLLBACK"); return res.status(400).json({ error: "stock", id: w.id, left: p.stock }); }
      items.push({ id: p.id, name: p.name_ar, name_fr: p.name_fr, price: p.price, qty: w.qty, image: p.images[0] || "" });
      subtotal += p.price * w.qty;
      if (p.stock !== null) await client.query(`UPDATE products SET stock=stock-$1 WHERE id=$2`, [w.qty, p.id]);
    }
    const s = (await client.query(`SELECT data FROM settings WHERE id=1`)).rows[0].data;
    let delivery = 0;
    if (s.delivery && s.delivery.enabled) {
      const code = (wilaya.match(/^\d+/) || [""])[0].replace(/^0/, "");
      const v = s.delivery.prices && s.delivery.prices[code];
      delivery = int(v, int(s.delivery.default_price, 0));
    }
    const { rows } = await client.query(
      `INSERT INTO orders (name,phone,wilaya,commune,address,note,items,subtotal,delivery,total,lang)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [name, phone, wilaya, str(b.commune, 80), str(b.address, 200), str(b.note, 400), JSON.stringify(items), subtotal, delivery, subtotal + delivery, b.lang === "fr" ? "fr" : "ar"]);
    await client.query("COMMIT");
    res.json({ ok: true, id: rows[0].id, total: subtotal + delivery, delivery });
  } catch (e) { await client.query("ROLLBACK").catch(() => {}); throw e; }
  finally { client.release(); }
}));

app.get("/img/u/:id", wrap(async (req, res) => {
  const id = int(String(req.params.id).replace(/\.\w+$/, ""), 0);
  const { rows } = await q(`SELECT mime,data FROM images WHERE id=$1`, [id]);
  if (!rows[0]) return res.status(404).end();
  res.set("Content-Type", rows[0].mime);
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.send(rows[0].data);
}));

/* ---------------- API admin ---------------- */
app.post("/api/admin/login", wrap(async (req, res) => {
  if (!limit("l:" + (req.ip || "x"), 10, 15 * 60 * 1000)) return res.status(429).json({ error: "too_many" });
  const pw = str(req.body && req.body.password, 200);
  const s = await getSettings();
  const ok = s.admin_hash ? checkPw(pw, s.admin_hash) : pw === ADMIN_PASSWORD;
  if (!ok) return res.status(401).json({ error: "bad" });
  res.json({ token: makeToken() });
}));

const A = express.Router();
A.use(auth);

A.get("/stats", wrap(async (req, res) => {
  const r = await q(`SELECT
    (SELECT count(*)::int FROM orders WHERE status='new') AS new_orders,
    (SELECT count(*)::int FROM orders WHERE created_at > date_trunc('month', now())) AS month_orders,
    (SELECT coalesce(sum(total),0)::int FROM orders WHERE status='delivered' AND created_at > date_trunc('month', now())) AS month_sales,
    (SELECT count(*)::int FROM products) AS products,
    (SELECT count(*)::int FROM products WHERE stock IS NOT NULL AND stock <= 2) AS low_stock`);
  res.json(r.rows[0]);
}));

A.get("/orders", wrap(async (req, res) => {
  const params = []; let where = "";
  if (req.query.status && req.query.status !== "all") { params.push(str(req.query.status, 20)); where = "WHERE status=$1"; }
  const { rows } = await q(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT 300`, params);
  res.json(rows);
}));
const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];
A.patch("/orders/:id", wrap(async (req, res) => {
  const st = str(req.body.status, 20);
  if (!STATUSES.includes(st)) return res.status(400).json({ error: "status" });
  const id = int(req.params.id, 0);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(`SELECT status, items FROM orders WHERE id=$1 FOR UPDATE`, [id]);
    if (!rows[0]) { await client.query("ROLLBACK"); return res.status(404).json({ error: "notfound" }); }
    const was = rows[0].status;
    // rendre le stock si annulée, le reprendre si réactivée
    if (was !== "cancelled" && st === "cancelled")
      for (const it of rows[0].items) await client.query(`UPDATE products SET stock=stock+$1 WHERE id=$2 AND stock IS NOT NULL`, [it.qty, it.id]);
    if (was === "cancelled" && st !== "cancelled")
      for (const it of rows[0].items) await client.query(`UPDATE products SET stock=GREATEST(stock-$1,0) WHERE id=$2 AND stock IS NOT NULL`, [it.qty, it.id]);
    await client.query(`UPDATE orders SET status=$1 WHERE id=$2`, [st, id]);
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (e) { await client.query("ROLLBACK").catch(() => {}); throw e; }
  finally { client.release(); }
}));
A.delete("/orders/:id", wrap(async (req, res) => { await q(`DELETE FROM orders WHERE id=$1`, [int(req.params.id, 0)]); res.json({ ok: true }); }));

A.get("/products", wrap(async (req, res) => {
  const { rows } = await q(`SELECT * FROM products ORDER BY created_at DESC`); res.json(rows);
}));
function productBody(b) {
  const imgs = (Array.isArray(b.images) ? b.images : []).map(x => str(x, 300)).filter(x => /^\/img\//.test(x)).slice(0, 8);
  const stock = b.stock === "" || b.stock === null || b.stock === undefined ? null : Math.max(0, int(b.stock, 0));
  const old = int(b.old_price, null);
  return [int(b.category_id, null), str(b.name_ar, 120), str(b.name_fr, 120), str(b.desc_ar, 2000), str(b.desc_fr, 2000),
    Math.max(0, int(b.price, 0)), old && old > 0 ? old : null, stock, imgs, b.active !== false, !!b.featured];
}
A.post("/products", wrap(async (req, res) => {
  const v = productBody(req.body || {}); if (!v[1]) return res.status(400).json({ error: "name" });
  const { rows } = await q(`INSERT INTO products (category_id,name_ar,name_fr,desc_ar,desc_fr,price,old_price,stock,images,active,featured)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, v);
  res.json(rows[0]);
}));
A.put("/products/:id", wrap(async (req, res) => {
  const v = productBody(req.body || {}); if (!v[1]) return res.status(400).json({ error: "name" });
  const { rows } = await q(`UPDATE products SET category_id=$1,name_ar=$2,name_fr=$3,desc_ar=$4,desc_fr=$5,price=$6,old_price=$7,stock=$8,images=$9,active=$10,featured=$11
    WHERE id=$12 RETURNING *`, [...v, int(req.params.id, 0)]);
  res.json(rows[0] || {});
}));
A.delete("/products/:id", wrap(async (req, res) => { await q(`DELETE FROM products WHERE id=$1`, [int(req.params.id, 0)]); res.json({ ok: true }); }));

A.get("/categories", wrap(async (req, res) => {
  const { rows } = await q(`SELECT c.*, (SELECT count(*)::int FROM products p WHERE p.category_id=c.id) AS count FROM categories c ORDER BY sort,id`);
  res.json(rows);
}));
function catBody(b) {
  return [str(b.name_ar, 60), str(b.name_fr, 60), str(b.word, 12).toUpperCase(), str(b.image, 300), int(b.sort, 0), b.active !== false];
}
A.post("/categories", wrap(async (req, res) => {
  const v = catBody(req.body || {}); if (!v[0]) return res.status(400).json({ error: "name" });
  const slug = (str(req.body.slug, 40) || v[1] || "cat").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cat";
  const { rows } = await q(`INSERT INTO categories (name_ar,name_fr,word,image,sort,active,slug) VALUES ($1,$2,$3,$4,$5,$6,$7 || CASE WHEN EXISTS(SELECT 1 FROM categories WHERE slug=$7) THEN '-' || floor(random()*1000)::text ELSE '' END) RETURNING *`, [...v, slug]);
  res.json(rows[0]);
}));
A.put("/categories/:id", wrap(async (req, res) => {
  const v = catBody(req.body || {}); if (!v[0]) return res.status(400).json({ error: "name" });
  const { rows } = await q(`UPDATE categories SET name_ar=$1,name_fr=$2,word=$3,image=$4,sort=$5,active=$6 WHERE id=$7 RETURNING *`, [...v, int(req.params.id, 0)]);
  res.json(rows[0] || {});
}));
A.delete("/categories/:id", wrap(async (req, res) => { await q(`DELETE FROM categories WHERE id=$1`, [int(req.params.id, 0)]); res.json({ ok: true }); }));

A.get("/services", wrap(async (req, res) => { res.json((await q(`SELECT * FROM services ORDER BY kind, sort, id`)).rows); }));
A.post("/services", wrap(async (req, res) => {
  const b = req.body || {}; if (!str(b.name_ar)) return res.status(400).json({ error: "name" });
  const { rows } = await q(`INSERT INTO services (kind,icon,name_ar,name_fr,sort,active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [b.kind === "flexy" ? "flexy" : "repair", str(b.icon, 8), str(b.name_ar, 80), str(b.name_fr, 80), int(b.sort, 0), b.active !== false]);
  res.json(rows[0]);
}));
A.put("/services/:id", wrap(async (req, res) => {
  const b = req.body || {};
  const { rows } = await q(`UPDATE services SET kind=$1,icon=$2,name_ar=$3,name_fr=$4,sort=$5,active=$6 WHERE id=$7 RETURNING *`,
    [b.kind === "flexy" ? "flexy" : "repair", str(b.icon, 8), str(b.name_ar, 80), str(b.name_fr, 80), int(b.sort, 0), b.active !== false, int(req.params.id, 0)]);
  res.json(rows[0] || {});
}));
A.delete("/services/:id", wrap(async (req, res) => { await q(`DELETE FROM services WHERE id=$1`, [int(req.params.id, 0)]); res.json({ ok: true }); }));

A.get("/settings", wrap(async (req, res) => { res.json((await getSettings()).data); }));
A.put("/settings", wrap(async (req, res) => {
  const cur = (await getSettings()).data, b = req.body || {}, next = { ...cur };
  for (const k of Object.keys(DEFAULT_SETTINGS)) {
    if (!(k in b)) continue;
    if (k === "ads") {
      next.ads = (Array.isArray(b.ads) ? b.ads : []).slice(0, 6)
        .map(a => ({ image: str(a && a.image, 300), link: str(a && a.link, 400), active: !!(a && a.active) }))
        .filter(a => /^\/img\//.test(a.image));
    } else if (k === "delivery") {
      const d = b.delivery || {}, prices = {};
      for (const [w, p] of Object.entries(d.prices || {})) { const n = int(p, null); if (n !== null && n >= 0) prices[String(int(w, 0))] = n; }
      next.delivery = { enabled: !!d.enabled, default_price: Math.max(0, int(d.default_price, 0)), prices };
    } else if (k === "lat" || k === "lng") next[k] = Number(b[k]) || cur[k];
    else next[k] = str(b[k], 400);
  }
  await q(`UPDATE settings SET data=$1 WHERE id=1`, [next]);
  res.json(next);
}));
A.post("/password", wrap(async (req, res) => {
  const pw = str(req.body && req.body.password, 200);
  if (pw.length < 6) return res.status(400).json({ error: "short" });
  await q(`UPDATE settings SET admin_hash=$1 WHERE id=1`, [hashPw(pw)]);
  res.json({ ok: true });
}));

A.post("/upload", wrap(async (req, res) => {
  const m = /^data:(image\/(webp|jpeg|png));base64,(.+)$/.exec(String(req.body && req.body.data || ""));
  if (!m) return res.status(400).json({ error: "format" });
  const buf = Buffer.from(m[3], "base64");
  if (buf.length > 2.5 * 1024 * 1024) return res.status(400).json({ error: "size" });
  const { rows } = await q(`INSERT INTO images (mime,data) VALUES ($1,$2) RETURNING id`, [m[1], buf]);
  res.json({ url: `/img/u/${rows[0].id}.${m[2] === "jpeg" ? "jpg" : m[2]}` });
}));

app.use("/api/admin", A);
app.use("/api", (req, res) => res.status(404).json({ error: "notfound" }));

/* ---------------- statique ---------------- */
const pub = path.join(__dirname, "public");
app.use(express.static(pub, {
  extensions: ["html"],
  setHeaders(res, f) {
    if (/\.(woff2|webp|png|jpg)$/.test(f)) res.set("Cache-Control", "public, max-age=2592000");
    else res.set("Cache-Control", "no-cache");
  }
}));
app.get("/admin*", (req, res) => res.sendFile(path.join(pub, "admin.html")));
app.get("*", (req, res) => res.sendFile(path.join(pub, "index.html")));

migrate().then(() => app.listen(PORT, () => console.log("Elzzaim store on :" + PORT)))
  .catch(e => { console.error("migration", e); process.exit(1); });
