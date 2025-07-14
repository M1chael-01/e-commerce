// Import balíčků
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const stringSimilarity = require("string-similarity");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY || "your stripe key"); 

const { filterProduct } = require('./products');

const { getAllProducts, getOneProduct, getNewProducts } = require("./products");

// Načti proměnné z .env
require("dotenv").config();

// Inicializace Express aplikace
const app = express();
const PORT = process.env.PORT || 5000;

// Proměnné z .env
const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;





const storeItems = new Map([[1, { price: 1, name: "learn react" }]]);

// ----------------------
// Middlewares
// ----------------------

// Bezpečnostní hlavičky
app.use(helmet());

// CORS pro frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_KEY || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000, // 30 minut
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// Parsování cookies
app.use(cookieParser());

// Parsování JSON těla požadavků
app.use(express.json());

// ----------------------

// ----------------------
const users = [
  { name: "Jan Novák", username: "jan", password: "hashedheslo1" },
  { name: "Petr Svoboda", username: "petr", password: "hashedheslo2" },
  { name: "Eva Černá", username: "eva", password: "hashedheslo3" },
];

// ----------------------
// Pomocné funkce
// ----------------------

// Generování náhodného slevového kódu
function generateDiscountCode() {
  const chars = "abcefghijklmnopqrstABCDEFGHJKLMNOP1234@&?";
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// Inicializace session s discount kódem
function generateSession(req) {
  if (!req.session.discountCode) req.session.discountCode = generateDiscountCode();
}

// Middleware pro ověření JWT tokenu
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token chybí" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Neplatný token" });
    req.user = user;
    next();
  });
}

// ----------------------
// API endpointy
// ----------------------

// Vytvoření Stripe checkout session
app.post("/createCheckout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel"
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Přihlášení a vydání JWT tokenu
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== USERNAME || password !== PASSWORD) {
    return res.status(401).json({ error: "Neplatné přihlašovací údaje" });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ accessToken: token });
});

// Získání všech produktů (autorizováno)
app.post("/products", authenticateJWT, async (req, res) => {
  try {
    const allProducts = await getAllProducts();
    res.json(allProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba při získávání produktů" });
  }
});

// Získání jednoho produktu podle ID
app.post("/oneProduct", authenticateJWT, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "ID produktu chybí" });
  const oneProduct = await getOneProduct(id);
  if (!oneProduct) return res.status(404).json({ error: "Produkt nebyl nalezen" });
  res.json(oneProduct);
});

// Získání nových produktů
app.post("/newProducts", authenticateJWT, async (req, res) => {
  try {
    const newProducts = await getNewProducts();
    res.json(newProducts);
  } catch {
    res.status(404).json({ error: "Nové produkty nebyly nalezené" });
  }
});


app.post("/filter", async (req, res) => {
  console.log(req.body);
  try {
    const filteredProducts = await filterProduct(req.body);
    res.json(filteredProducts);
  } catch (error) {
    console.error('Chyba při filtrování produktů:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});

app.post("/filterData", (req, res) => {
  const { incomingData } = req.body;

  //  Uložení filtrů do session
  req.session.filters = incomingData;

  console.log("📦 Přijaté filtry:", incomingData);
  console.log("💾 Uloženo v session:", req.session.filters);

  res.json({ message: "Filtry přijaty a uloženy do session", data: incomingData });
});


app.post("/resultFilter", (req, res) => {
  if (req.session.filters) {
    // Odešli uložené filtry klientovi jako JSON
    res.json({ filters: req.session.filters });
  } else {  
    // Pokud filtry v session nejsou, pošli prázdný objekt nebo vhodnou zprávu
    res.json({ filters: null });
  }
});


app.post("/gottenFilterData" , (req,res) =>{
  const {data,time} = req.body;

  if(data && time) {

  }
})


// Získání slevového kódu
app.post("/api/discount", authenticateJWT, (req, res) => {
  generateSession(req);
  req.session.dismissed = false;
  res.json({ code: req.session.discountCode });
});

// Označení promo boxu jako zavřeného
app.post("/api/deletePromobox", authenticateJWT, (req, res) => {
  req.session.dismissed = true;
  res.status(200).json({ message: "Promo box dismissed" });
});

// Uložení uživatelských dat do session
app.post("/saveUserInfo", authenticateJWT, (req, res) => {
  req.session.userInfo = req.body.userInfo;
  res.status(200).json({ message: "Data saved" });
});

// Získání uživatelských dat ze session
app.get("/getUserInfo", authenticateJWT, (req, res) => {
  const userInfo = req.session.userInfo;
  if (userInfo) {
    res.status(200).json({ message: "Přijata uživatelská data", data: userInfo });
  } else {
    res.status(404).json({ message: "Žádná uživatelská data v session" });
  }
});

// Přidání produktu do košíku (uloženo v cookie)
app.post("/addToCart", (req, res) => {
  const { productId } = req.body;
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  cart.push(productId);
  res.cookie("cart", JSON.stringify(cart), { httpOnly: true, maxAge: 86400000 }); // 1 den
  res.json({ message: "Added to cart", cart });
});

// Získání počtu položek v košíku
app.post("/getItemCount", authenticateJWT, (req, res) => {
  const cart = req.session.cart;
  res.json({ count: cart ? cart.length : 0 });
});

// Získání objednaných produktů
app.post("/getOrders", authenticateJWT, (req, res) => {
  const { cartToken } = req.body;
  let cart = [];

  if (cartToken) {
    try {
      const decoded = jwt.verify(cartToken, JWT_SECRET);
      cart = decoded.cart || [];
    } catch {
      cart = [4];
    }
  } else {
    cart = [4];
  }

  const orderedProducts = cart.map((item) => {
    const productId = typeof item === "object" ? item.id : item;
    const product = products.find((p) => p.id === productId);
    return product ? { ...product, quantity: 1 } : null;
  }).filter(Boolean);

  res.json({ orderedProducts });
});

// ----------------------
// Logika doporučení podobných produktů
// ----------------------

// Předzpracování textu pro podobnost
function preprocessText(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
}


// Převod textu na binární vektor
function textToVector(text, vectorLength = 100) {
  const tokens = preprocessText(text);
  const vec = new Array(vectorLength).fill(0);
  tokens.forEach(token => {
    const idx = wordIndex[token];
    if (idx && idx < vectorLength) vec[idx] = 1;
  });
  return vec;
}

// Výpočet kosinové podobnosti
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}



// Endpoint pro podobné produkty
app.post("/api/similar-products", (req, res) => {
  const { product, userBehavior } = req.body;
  if (!product || product.id === undefined) {
    return res.status(400).json({ error: "Missing product data" });
  }

  if (!req.session.userBehaviorData) req.session.userBehaviorData = {};
  const pid = product.id;

  // Aktualizace dat chování uživatele
  if (userBehavior) {
    if (!req.session.userBehaviorData[pid]) req.session.userBehaviorData[pid] = { totalViewTime: 0, clickCount: 0, lastClickTime: 0 };
    if (userBehavior.viewDurationSec) req.session.userBehaviorData[pid].totalViewTime += userBehavior.viewDurationSec;
    if (userBehavior.lastClickedProductId) {
      req.session.userBehaviorData[pid].clickCount += 1;
      req.session.userBehaviorData[pid].lastClickTime = Date.now();
    }
  }

  const refVecEntry = productVectors.find(p => p.id === pid);
  if (!refVecEntry) return res.status(500).json({ error: "Product vector missing" });

  const similarProducts = [];

  for (const item of products) {
    if (item.id === pid) continue;

    const isSimilar = (
      item.gender === product.gender &&
      item.categorie === product.categorie &&
      item.price <= product.price + 250
    );

    if (isSimilar) {
      const itemVecEntry = productVectors.find(p => p.id === item.id);
      const mlSimilarity = itemVecEntry ? cosineSimilarity(refVecEntry.vector, itemVecEntry.vector) : 0;
      const nameSim = stringSimilarity.compareTwoStrings(product.name.toLowerCase(), item.name.toLowerCase());
      let score = 0.6 * mlSimilarity + 0.4 * nameSim;

      const stats = req.session.userBehaviorData[item.id];
      if (stats) {
        const freshnessBoost = Math.exp(-(Date.now() - stats.lastClickTime) / (1000 * 3600 * 24));
        const viewBoost = Math.min(stats.totalViewTime / 300, 1);
        const clickBoost = Math.min(stats.clickCount / 10, 1);
        score += (0.3 * viewBoost + 0.4 * clickBoost) * freshnessBoost;
      }

      similarProducts.push({ ...item, similarityScore: score });
    }
  }

  similarProducts.sort((a, b) => b.similarityScore - a.similarityScore);

  res.json({ similarProducts: similarProducts.slice(0, 5) });
});

// ----------------------
// Spuštění serveru
// ----------------------
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
