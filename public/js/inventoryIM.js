document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventoryIM.html"; // Redirect to the inventory page
});


// script.js
async function loadInventoryData() {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      
      const tbody = document.querySelector('.inventory-list tbody');
      tbody.innerHTML = ''; // Clear any existing rows
  
      products.forEach(product => {
        const row = document.createElement('tr');
        
        // Check for low stock alert
        let alertMessage = '';
        if (product.current_stock_level <= product.reorder_level) {
          alertMessage += 'Low Stock';
        }
  
        // Check for nearing expiration alert
        const expirationDate = new Date(product.expiration_date);
        const currentDate = new Date();
        const timeDifference = expirationDate - currentDate;
        const daysToExpiration = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
        if (daysToExpiration <= 30) { // Alert if expiration is within 30 days
          alertMessage += alertMessage ? ' | Near Expiration' : 'Near Expiration';
        }
  
        row.innerHTML = `
          <td>${product.product_id}</td>
          <td>${product.product_name}</td>
          <td>${product.brand}</td>
          <td>${product.product_category}</td>
          <td>${product.selling_price}</td>
          <td>${product.current_stock_level}</td>
          <td>${alertMessage || 'OK'}</td> <!-- Display 'OK' if no alerts -->
        `;
        
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error loading inventory data:', error);
    }
  }
  
  // Call the function to load data when the page loads
  window.onload = loadInventoryData;
  