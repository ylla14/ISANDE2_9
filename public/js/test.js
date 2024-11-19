// Define DOM elements
const supplierDropdown = document.getElementById('supplierDropdown');
const productDropdown = document.getElementById('productDropdown');
const unitPriceField = document.getElementById('unitPrice');
const quantitySlider = document.getElementById('quantitySlider');
const quantityValue = document.getElementById('quantityValue');
const totalPriceField = document.getElementById('totalPrice');

// Fetch and populate supplier options
fetch('/api/suppliers/')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  })
  .then(suppliers => {
    suppliers.forEach(supplier => {
      const option = document.createElement('option');
      option.value = supplier.supplier_id;
      option.textContent = supplier.supplier_name;
      supplierDropdown.appendChild(option);
    });
  })
  .catch(error => console.error('Error fetching suppliers:', error));

// Update product dropdown based on supplier
supplierDropdown.addEventListener('change', () => {
  const supplierId = supplierDropdown.value;

  // Clear previous products
  productDropdown.innerHTML = '<option value="">Select a product</option>';
  productDropdown.disabled = true;

  if (supplierId) {
    fetch(`/api/products/${supplierId}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(products => {
        products.forEach(product => {
          const option = document.createElement('option');
          option.value = JSON.stringify({ id: product.product_id, price: product.selling_price });
          option.textContent = product.product_name;
          productDropdown.appendChild(option);
        });
        productDropdown.disabled = false;
      })
      .catch(error => console.error('Error fetching products:', error));
  }
});

// Update unit price and calculate total on product selection
productDropdown.addEventListener('change', () => {
  const selectedProduct = productDropdown.value ? JSON.parse(productDropdown.value) : {};
  const unitPrice = selectedProduct.price || 0;

  unitPriceField.value = unitPrice > 0 ? `$${unitPrice.toFixed(2)}` : '$0.00';
  calculateTotal();
});

// Update quantity and calculate total
quantitySlider.addEventListener('input', () => {
  quantityValue.textContent = quantitySlider.value;
  calculateTotal();
});

// Calculate total price
function calculateTotal() {
  const selectedProduct = productDropdown.value ? JSON.parse(productDropdown.value) : {};
  const unitPrice = selectedProduct.price || 0;
  const quantity = parseInt(quantitySlider.value, 10) || 0;
  const totalPrice = unitPrice * quantity;

  totalPriceField.textContent = totalPrice > 0 ? totalPrice.toFixed(2) : '0.00';
}
