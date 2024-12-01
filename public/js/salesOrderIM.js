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

document.getElementById("profile-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "profileIM.html";
});

// Select the Inventory link by its ID
document.getElementById("suppliers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "suppliersIM.html"; // Redirect to the inventory page
});


// script.js
async function loadSalesOrderData() {
    try {
        const response = await fetch('/api/salesorders');
        const salesorders = await response.json(); // Use a plural variable name for clarity
        console.log('Fetched orders:', salesorders); // Check what data is received

        const tbody = document.querySelector('.salesorders-list table tbody'); // Targeting tbody within the table
        tbody.innerHTML = ''; // Clear any existing rows

        // Filter sales orders to only include those with "paid" status
        const paidOrders = salesorders.filter(order => order.status === 'paid');

        paidOrders.forEach(salesorder => { // Iterating over each sales order
            const row = document.createElement('tr');

            // Convert dates for the current sales order
            const orderDate = new Date(salesorder.purchased_date); // Use the correct date field
            const deliveryDate = new Date(salesorder.delivery_date);

            const orderDateDisplay = orderDate.toLocaleDateString();
            const deliveryDateDisplay = deliveryDate.toLocaleDateString();
            const inventoryStatus = salesorder.inventory_status === 'confirmed' ? 'Confirmed' : 'Pending';

            row.addEventListener('click', () => {
                console.log(salesorder); // This will show the structure of `salesorder`
                window.location.href = `OrderDetailIM.html?orderId=${salesorder.order_id}`; // Adjust to correct key name
            });

            row.innerHTML = `
                <td>${salesorder.order_code}</td>
                <td>${salesorder.customer_id}</td>
                <td>${orderDateDisplay}</td>
                <td>${deliveryDateDisplay}</td>
                <td>${salesorder.total_order_value}</td>
                <td>${inventoryStatus}</td>
            `;

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading sales order data:', error);
    }
}

function searchSalesOrder() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.salesorders-list tbody tr');

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
window.onload = loadSalesOrderData;
