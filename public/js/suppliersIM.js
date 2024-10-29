document.getElementById("home-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardIM.html"; // Redirect to the inventory page
});

// Select the Inventory link by its ID
document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventoryIM.html"; // Redirect to the inventory page
});

// Select the Inventory link by its ID
document.getElementById("suppliers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "suppliersIM.html"; // Redirect to the inventory page
});


// script.js
async function loadSuppliersData() {
    try {
        const response = await fetch('/api/suppliers');
        const suppliers = await response.json(); // Renamed variable to "suppliers" to match its content

        const tbody = document.querySelector('.suppliers-list table tbody'); // Targeting tbody within the table
        tbody.innerHTML = ''; // Clear any existing rows

        suppliers.forEach(supplier => { // Iterating over each supplier correctly
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${supplier.supplier_id}</td>
                <td>${supplier.supplier_name}</td>
                <td>${supplier.contact_person}</td>
                <td>${supplier.email_address}</td>
                <td>${supplier.contact_details}</td>
                <td>Order History</td> <!-- Placeholder for "Order History" column -->
            `;
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading suppliers data:', error);
    }
}

function searchSuppliers() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.suppliers-list tbody tr');
    
    rows.forEach(row => {
        const supplierName = row.children[1].textContent.toLowerCase(); // Assumes supplier name is in the 2nd column
        if (supplierName.includes(searchInput)) {
            row.style.display = ''; // Show row if it matches
        } else {
            row.style.display = 'none'; // Hide row if it doesn't match
        }
    });
}


// Call the function to load data when the page loads
window.onload = loadSuppliersData;