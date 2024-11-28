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


async function loadOrderSRData() {
    try {
        const response = await fetch('/api/OrdersSR');
        const ordersSR = await response.json();
        console.log('Fetched orders:', ordersSR); // Check what data is received

        const tbody = document.querySelector('.order-list table tbody');
        tbody.innerHTML = '';

        ordersSR.forEach(order => {
            const row = document.createElement('tr');
            const orderDate = new Date(order.purchased_date); // Use the correct date field
            const orderDateDisplay = orderDate.toLocaleDateString();

            row.addEventListener('click', () => {
                console.log(`/orderDetail.html?orderId=${order.order_id}`);
                window.location.href = `orderDetail.html?orderId=${order.order_id}`;
            });

            row.innerHTML = `
                <td>${order.order_code}</td>
                <td>${orderDateDisplay}</td>
                <td>${order.customer_id}</td>
                <td>${order.customer_name}</td>
                <td>${order.status}</td>
            `;
            
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading sales order data:', error);
    }
}



function searchOrders() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.order-list tbody tr');
    
    rows.forEach(row => {
        const rowText = Array.from(row.children)
            .map(cell => cell.textContent.toLowerCase())
            .join(' ');

        if (rowText.includes(searchInput)) {
            row.style.display = ''; 
        } else {
            row.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', loadOrderSRData);
