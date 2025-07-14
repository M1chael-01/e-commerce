const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

client.connect()
  .then(() => console.log('✅ Připojeno k PostgreSQL (products module)'))
  .catch(err => {
    console.error('❌ Chyba při připojení k DB (products module):', err.stack);
    process.exit(1);
  });

// Získání všech produktů
async function getAllProducts() {
  try {
    const result = await client.query('SELECT * FROM products');
    return result.rows;
  } catch (err) {
    throw err;
  }
}

// Získání jednoho produktu dle ID
async function getOneProduct(id) {
  try {
    const result = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

// Získání nových produktů
async function getNewProducts() {
  try {
    const result = await client.query("SELECT * FROM products WHERE new = $1", [true]);
    return result.rows;
  } catch (err) {
    throw err;
  }
}

async function filterProduct(filter) {
  const {
    gender,
    category,
    minPrice,
    maxPrice,
    size,
    rating,
    isNew,
    isRecommended,
    hasDiscount,
  } = filter;

  const conditions = [];
  const values = [];
  let idx = 1;

  const normalizeGender = (g) => {
    if (!g) return null;
    if (g === "muzi") return "muži";
    if (g === "zeny") return "ženy";
    if (g === "deti") return "děti";
    return g;
  };

  const normGender = normalizeGender(gender);
  if (normGender) {
    conditions.push(`gender = $${idx++}`);
    values.push(normGender);
  }

  if (category) {
    conditions.push(`LOWER(categorie) = LOWER($${idx++})`);
    values.push(category);
  }

  if (minPrice !== null && minPrice !== undefined) {
    conditions.push(`price >= $${idx++}`);
    values.push(minPrice);
  }

  if (maxPrice !== null && maxPrice !== undefined) {
    conditions.push(`price <= $${idx++}`);
    values.push(maxPrice);
  }

  if (size) {
    conditions.push(`$${idx++} = ANY(sizes)`);
    values.push(size);
  }

  if (rating !== null && rating !== undefined) {
    conditions.push(`rating >= $${idx++}`);
    values.push(rating);
  }

  if (isNew === true) {
    conditions.push(`new = true`);
  } else if (isNew === false) {
    conditions.push(`new = false`);
  }

  if (isRecommended === true) {
    conditions.push(`recommend = true`);
  } else if (isRecommended === false) {
    conditions.push(`recommend = false`);
  }

  if (hasDiscount === true) {
    conditions.push(`discount IS NOT NULL`);
  }

  let query = 'SELECT * FROM products';
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const result = await client.query(query, values);
  return result.rows;
}

module.exports = {
  getAllProducts,
  getOneProduct,
  getNewProducts,
  filterProduct
};
