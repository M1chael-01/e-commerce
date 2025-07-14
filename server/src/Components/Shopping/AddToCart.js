import "../../styles/AddToCart.css"; // Import styles for AddToCart component

// Simple component to show confirmation that a product was added to the cart
const AddToCart = ({ id }) => {
  return (
    <main className="cartBox">
      <div className="content">
        {/* Display message confirming the product addition */}
        <h2>Produkt byl přidán</h2>
      </div>
    </main>
  );
};

export default AddToCart;
