document.getElementById("home-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardIM.html"; // Redirect to the inventory page
});

// Select the Inventory link by its ID
document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventoryIM.html"; // Redirect to the inventory page
});

document.getElementById("sales-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "salesOrderIM.html"; // Redirect to the inventory page
});


// Select the Inventory link by its ID
document.getElementById("suppliers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "suppliersIM.html"; // Redirect to the inventory page
});


// script.js
async function loadInventoryData() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        // Sort products by SKU in ascending order
        products.sort((a, b) => a.product_id.localeCompare(b.product_id));
        
        const tbody = document.querySelector('.inventory-list tbody');
        tbody.innerHTML = ''; // Clear any existing rows

        products.forEach(product => {
            const row = document.createElement('tr');
            
            // Check for low stock alert
            let alertMessage = '';
            let alertColor = 'black'; // Default color

            if (product.current_stock_level <= product.reorder_level) {
                alertMessage = 'Low Stock';
                alertColor = 'red'; // Set color to red for low stock
            }
  
            // Check for nearing expiration alert if expiration date is provided
            let expirationDisplay = '';
            if (product.expiration_date) {
                const expirationDate = new Date(product.expiration_date);
                const currentDate = new Date();
                const timeDifference = expirationDate - currentDate;
                const daysToExpiration = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                
                expirationDisplay = expirationDate.toLocaleDateString(); // Format expiration date for display

                if (daysToExpiration <= 30) { // Alert if expiration is within 30 days
                    alertMessage += alertMessage ? ' | Near Expiration' : 'Near Expiration';
                    alertColor = 'yellow'; // Set color to yellow for near expiration
                }
            }

            // Set alert color based on the message
            const finalAlertMessage = alertMessage || 'OK';
            const finalAlertColor = alertMessage ? alertColor : 'green'; // Green if OK

            row.innerHTML = `
                <td>${product.product_id}</td>
                <td>${product.product_name}</td>
                <td>${product.brand}</td>
                <td>${product.product_category}</td>
                <td>${product.selling_price}</td>
                <td>${product.current_stock_level}</td>
                <td>${product.reorder_level}</td>
                <td>${expirationDisplay}</td> <!-- Leave blank if expiration_date is null -->
                <td style="color: ${finalAlertColor};">${finalAlertMessage}</td> <!-- Set color based on alert status -->
            `;
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading inventory data:', error);
    }
}

function searchInventory() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.inventory-list tbody tr');
    
    rows.forEach(row => {
        const rowText = Array.from(row.children) // Get all cells in the row
            .map(cell => cell.textContent.toLowerCase()) // Convert text content to lowercase
            .join(' '); // Join all cell content to make searchable string

        // Check if the search input is included in the row text
        if (rowText.includes(searchInput)) {
            row.style.display = ''; // Show row if it matches
        } else {
            row.style.display = 'none'; // Hide row if it doesn't match
        }
    });
}


// Call the function to load data when the page loads
window.onload = loadInventoryData;
