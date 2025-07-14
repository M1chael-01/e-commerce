class Products {
  async getAllProducts() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❗ Token chybí – přihlaste se prosím.");
      return [];
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      return [];
    }
  }

  async getOneProduct(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❗ Token chybí – přihlaste se prosím.");
      return null;
    }

    try {
      const res = await fetch("http://localhost:5000/oneProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(`Chyba při získávání produktu: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("❌ Chyba při načítání jednoho produktu:", err);
      return null;
    }
  }

  async getNewProducts() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❗ Token chybí – přihlaste se prosím.");
      return [];
    }

    try {
      const res = await fetch("http://localhost:5000/newProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Chyba při získávání nových produktů: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("❌ Chyba při načítání nových produktů:", err);
      return [];
    }
  }
}

export default new Products();
