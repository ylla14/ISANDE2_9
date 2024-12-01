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

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('customerId');

// Fetch customer details on page load
if (customerId) {
    fetchCustomerDetails(customerId);
}
});

// Function to fetch customer details from the API and populate the page
async function fetchCustomerDetails(customerId) {
    console.log('Fetching customer details for:', customerId);
    try {
        const response = await fetch(`/api/customersDets/${customerId}`);
        console.log('API Response:', response);

        if (response.status === 404) {
            console.error(`Customer with ID ${customerId} not found.`);
            alert(`Customer with ID ${customerId} not found.`);
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }
        
        const data = await response.json();
        console.log('Customer Data:', data);
        populateCustomerDetails(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Error retrieving customer details.');
    }
}

// Function to populate customer details on the page
function populateCustomerDetails(data) {
    // Populate customer profile information
    document.getElementById('customer-id').textContent = data.customer_id;
    document.getElementById('full-name').textContent = data.full_name;
    document.getElementById('contact-number').textContent = data.contact_number;
    document.getElementById('email').textContent = data.email;

    document.getElementById('order-address').textContent = data.order_address;
    document.getElementById('barangay').textContent = data.barangay;
    document.getElementById('city').textContent = data.city;

    // Populate order history table
    const ordersTableBody = document.getElementById('orders-table-body');
    ordersTableBody.innerHTML = ''; // Clear existing rows

    data.orders.forEach(order => {
        const row = document.createElement('tr');

        // Create table row content
        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.purchased_date}</td>
            <td>${order.payment_ref_num}</td>
            <td>${order.sales_rep_id}</td>
        `;

        // Add click event to redirect to OrderDetail.html with the specific order_id
        row.addEventListener('click', () => {
            window.location.href = `OrderDetail.html?orderId=${order.order_id}`;
        });

        // Append the row to the table body
        ordersTableBody.appendChild(row);
    });
}

