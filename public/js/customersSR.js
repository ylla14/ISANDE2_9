document.getElementById("dashboard-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardSR.html"; // Redirect to the inventory page
});

document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventorySR.html"; // Redirect to the inventory page
});

document.getElementById("order-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "orderSR.html"; // Redirect to the inventory page
});


document.getElementById("customers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "customersSR.html"; // Redirect to the inventory page
});

document.getElementById("profile-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "profileSR.html";
});


// Event listener for the "Add New" button
document.getElementById("add-new-button").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default button action
    window.location.href = "createorderSR.html"; // Redirect to the new item page
});


document.addEventListener("DOMContentLoaded", () => {
    fetchCustomers(); // Fetch customers when the page loads

    // Search functionality
    document.querySelector(".search-input").addEventListener("input", searchCustomers);
});

// Fetch customers from the server
async function fetchCustomers() {
    try {
        const response = await fetch("/api/customers"); // Call the GET route
        if (!response.ok) {
            throw new Error("Failed to fetch customer data");
        }

        const customers = await response.json(); // Parse the JSON response
        populateCustomerTable(customers); // Pass data to the function to populate the table
    } catch (error) {
        console.error("Error fetching customers:", error);
        alert("Failed to load customer data. Please try again later.");
    }
}

// Populate the customer table with fetched data
function populateCustomerTable(customers) {
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    customers.forEach(customer => {
        const row = document.createElement("tr");

        row.addEventListener('click', () => {
            console.log(`/customersDetailSR.html?customerId=${customer.customer_id}`);
            window.location.href = `customersDetailSR.html?customerId=${customer.customer_id}`;
        });

        row.innerHTML = `
            <td>${customer.customer_id}</td>
            <td>${customer.fname} ${customer.lname}</td>
            <td>${customer.email}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Search for customers in the table
function searchCustomers() {
    const searchTerm = document.querySelector(".search-input").value.toLowerCase();
    const tableRows = document.querySelectorAll("tbody tr");

    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchTerm) ? "" : "none";
    });
}

// Optional: Filter button functionality (placeholder for further enhancements)
function downloadStockAging() {
    alert("Filter functionality is not yet implemented.");
}

document.addEventListener('DOMContentLoaded', loadOrderSRData);
