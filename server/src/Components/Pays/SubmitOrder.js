const SubmitOrder = () => {
  // Function triggered when user clicks the checkout button
  const handleCheckout = async () => {
    try {
      // Send POST request to backend endpoint to create a Stripe checkout session
      const response = await fetch('http://localhost:5000/createCheckout', {
        method: 'POST', // Use POST to send data
        headers: {
          'Content-Type': 'application/json', // Inform server we send JSON
        },
        // Body contains order details for Stripe - here a sample item
        body: JSON.stringify({
          items: [
            {
              price_data: {
                currency: 'czk', // Currency set to Czech koruna
                product_data: {
                  name: 'Testovací produkt', // Name of product shown on checkout
                },
                unit_amount: 1500, // Price in haléře (1/100 CZK), so 1500 = 15.00 CZK
              },
              quantity: 1, // Quantity of this product
            },
          ],
        }),
      });

      // Parse JSON response from server
      const data = await response.json();

      // If server returned a Stripe Checkout URL, redirect browser there
      if (data.url) {
        window.location.href = data.url; // Redirect user to Stripe Checkout page
      } else {
        // Show error alert if Stripe returned error info
        alert('Chyba Stripe: ' + data.error);
      }
    } catch (error) {
      // Log error to console and alert user in case of network or other errors
      console.error('Chyba při platbě:', error);
      alert('Došlo k chybě při odesílání objednávky');
    }
  };

  // Render a button that triggers checkout when clicked
  return (
    <div>
      <h2>Odeslat objednávku</h2>
      <button onClick={handleCheckout}>Zaplatit přes Stripe</button>
    </div>
  );
};

export default SubmitOrder;
