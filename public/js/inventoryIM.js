// HEADER REDIRECT

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

document.getElementById("profile-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "profileIM.html";
});

document.getElementById("add-prod").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "addProdIM.html"; // Redirect to the inventory page
});



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

            // Stock alert logic
            let stockAlertMessage = product.stock_status || 'OK';
            let stockAlertColor = 'green'; // Default color for OK

            if (stockAlertMessage === 'Low Stock') {
                stockAlertColor = 'red'; // Red color for low stock
                row.style.backgroundColor = 'rgba(255, 99, 71, 0.2)'; // Light red background
            }

            // Expiry alert logic
            let expiryAlertMessage = product.expiry_status || 'OK';
            let expiryAlertColor = 'green'; 

            if (expiryAlertMessage === 'Near Expiry') {
                expiryAlertColor = '#f1c40f'; 
                row.style.backgroundColor = 'rgba(241, 196, 15, 0.2)'; 
            }

            // If both "Low Stock" and "Near Expiry," use blue
            if (stockAlertMessage === 'Low Stock' && expiryAlertMessage === 'Near Expiry') {
                row.style.backgroundColor = 'rgba(0, 118, 255, 0.1)'; 
            }

            row.addEventListener('click', () => {
                // Navigate to the products details page with the product_id as a query parameter
                window.location.href = `/prodDetailsIM.html?productId=${product.product_id}`;
            });

            row.innerHTML = `
                <td>${product.product_id}</td>
                <td>${product.product_name}</td>
                <td>${product.brand}</td>
                <td>${product.product_category}</td>
                <td>${product.selling_price}</td>
                <td>${product.current_stock_level}</td>
                <td>${product.reorder_level}</td>
                <td>${product.expiration_date ? new Date(product.expiration_date).toLocaleDateString() : ''}</td>
                <td style="color: ${stockAlertColor};">${stockAlertMessage}</td>
                <td style="color: ${expiryAlertColor};">${expiryAlertMessage}</td>
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

async function loadSidebarAlerts() {
    try {
        const response = await fetch('/api/alerts');
        const products = await response.json();

        const lowStockProducts = products.filter(product => product.stock_status === 'Low Stock');
        const nearExpiryProducts = products.filter(product => product.expiry_status === 'Near Expiry');

        const sidebarContent = document.querySelector('.sidebar-content');
        sidebarContent.innerHTML = `
            <h2>Product Alerts</h2>
            <div class="low-stock-group">
                <h3 style="color: red;">Low Stock Products</h3>
                ${lowStockProducts.length ? `
                    <ul>
                        ${lowStockProducts.map(product => `
                            <li>${product.product_name} (ID: ${product.product_id}, Stock: ${product.current_stock_level})</li>
                        `).join('')}
                    </ul>
                ` : '<p>No low-stock products</p>'}
            </div>
            <hr>
            <div class="near-expiry-group">
                <h3 style="color: orange;">Near Expiry Products</h3>
                ${nearExpiryProducts.length ? `
                    <ul>
                        ${nearExpiryProducts.map(product => `
                            <li>${product.product_name} (ID: ${product.product_id}, Expiry: ${new Date(product.expiration_date).toLocaleDateString()})</li>
                        `).join('')}
                    </ul>
                ` : '<p>No near-expiry products</p>'}
            </div>
        `;
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

// Initialize the sidebar alerts
document.addEventListener('DOMContentLoaded', loadSidebarAlerts);

// Call the function to load data when the page loads
window.onload = loadInventoryData;
