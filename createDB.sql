CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price NUMERIC,
    discount NUMERIC,
    categorie VARCHAR(100),
    gender VARCHAR(10),
    new BOOLEAN,
    recommend BOOLEAN,
    sizes VARCHAR(50)[],
    description TEXT,
    description_long TEXT,
    features TEXT[],
    funk TEXT[],
    images TEXT[],
    rating NUMERIC,
    rating_note TEXT,
    image TEXT
);
