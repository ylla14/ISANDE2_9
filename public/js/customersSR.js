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

// Fetch customers from the server with filters
async function fetchCustomers(filter = {}, sort = {}) {
    try {
        const query = new URLSearchParams({ ...filter, ...sort }).toString();
        const response = await fetch(`/api/customers?${query}`); // Pass filter and sort parameters
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

function applyCustomerFilter() {
    // Get filter values
    const statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value : '';
    const sortField = document.getElementById('sort-field').value;
    const sortOrder = document.getElementById('sort-order').value;

    console.log('Filters applied:', statusFilter, sortField, sortOrder);

    // Build filter object, only adding status filter if it's set
    const filter = statusFilter ? { status: statusFilter } : {};

    // Build sort object only if both sort field and order are selected
    const sort = sortField && sortOrder ? { sortField, sortOrder } : {};

    // Call the function to fetch customers with applied filters and sorting
    fetchCustomers(filter, sort);
}

// Function to show/hide the filter section when the "Filter" button is clicked
function toggleFilterSection() {
    const filterSection = document.querySelector(".filter-section");
    // Toggle the visibility of the filter section
    if (filterSection.style.display === "none" || filterSection.style.display === "") {
        filterSection.style.display = "block";
    } else {
        filterSection.style.display = "none";
    }
}

// Event listener for the filter button
document.querySelector(".filter-btn").addEventListener("click", toggleFilterSection);


