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

async function loadSidebarRecentSalesOrders() {
    try {
        const response = await fetch('/api/recent-sales-orders');
        const orders = await response.json();

        const sidebarContent = document.querySelector('.sidebar-content');
        sidebarContent.innerHTML = `
            <h2>Recent Sales Orders</h2>
            ${orders.length ? `
                ${orders.map(order => {
                    const statusColor = order.inventory_status === 'confirmed' ? 'green' : 'red'; // Color based on inventory_status
                    return `
                        <div class="order-group" style="border-left: 5px solid ${statusColor}; padding-left: 10px;">
                            <p><strong>Order #${order.order_id} - ${order.customer_id}</strong> <br> 
                            Delivery Date: ${new Date(order.delivery_date).toLocaleDateString()}</p>
                            <ul>
                                ${order.order_items.map(item => `
                                    <li>${item.product_name} (Quantity: ${item.quantity}, Price: ₱${item.unit_price})</li>
                                `).join('')}
                            </ul>
                            <hr>
                        </div>
                    `;
                }).join('')}
            ` : '<p>No recent paid sales orders</p>'}
        `;
    } catch (error) {
        console.error('Error loading recent paid sales orders:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBrands();
    document.querySelector('.filter-btn').addEventListener('click', openFilterModal);
});

// Open and close modal
function openFilterModal() {
    document.getElementById('filter-modal').style.display = 'block';
}

function closeFilterModal() {
    document.getElementById('filter-modal').style.display = 'none';
}

// Fetch unique brands
function fetchBrands() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            const brands = [...new Set(data.map(item => item.brand))];
            const brandDropdown = document.getElementById('filter-brand');
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching brands:', error));
}

// Apply filters
function applyFilters() {
    const form = document.getElementById('filter-form');
    const lowStock = form.querySelector('input[name="filter-low-stock"]').checked;
    const nearExpiry = form.querySelector('input[name="filter-near-expiry"]').checked;
    const brand = form.querySelector('#filter-brand').value;

    const queryParams = new URLSearchParams({
        lowStock,
        nearExpiry,
        brand,
    });

    fetch(`/api/products/filter?${queryParams}`)
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error applying filters:', error));
}

// Populate table with filtered data
function populateTable(data) {
    const tbody = document.querySelector('.inventory-list table tbody');
    tbody.innerHTML = ''; // Clear current rows

    data.forEach(product => {
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
            // Navigate to the product details page with the product_id as a query parameter
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

    closeFilterModal();
}




// Initialize the sidebar alerts
document.addEventListener('DOMContentLoaded', loadSidebarRecentSalesOrders);

// Call the function to load data when the page loads
window.onload = loadInventoryData;
