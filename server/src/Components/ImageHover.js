class ImageHover {
  // Constructor takes the current products array and a setter function to update products state
  constructor(products, setProducts) {
    this.products = products;      // Array of product objects
    this.setProducts = setProducts; // Function to update the products state
  }

  // Change product image to the second image on hover
  changeImage(id) {
    // Create a new products array with the image updated for the hovered product
    const updatedProducts = this.products.map((product) => {
      // Check if this is the product being hovered and has a second image
      if (product.id === id && product.images?.[1]) {
        // Return a new product object with image set to the second image
        return { ...product, image: product.images[1] };
      }
      // Return the product unchanged if not hovered or no second image
      return product;
    });

    // Update the products state with the new array
    this.setProducts(updatedProducts);
  }

  // Revert product image back to the original (first image) when hover ends
  returnImage(id) {
    // Create a new products array with the image reverted for the product
    const updatedProducts = this.products.map((product) => {
      // Check if this is the product being un-hovered and has a first image
      if (product.id === id && product.images?.[0]) {
        // Return a new product object with image set back to the first image
        return { ...product, image: product.images[0] };
      }
      // Return the product unchanged if not matching or no first image
      return product;
    });

    // Update the products state with the reverted images
    this.setProducts(updatedProducts);
  }
}

export default ImageHover;
