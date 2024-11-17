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

            row.innerHTML = `
                <td>${order.order_code}</td>
                <td>${orderDateDisplay}</td>
                <td>${order.customer_id}</td>
                <td>${order.customer_name}</td>
                <td>${order.status || 'Pending'}</td> <!-- EDIT THIS IF CREATE ORDER IS POLISHED -->
                <td>
                    <button class="add-btn" data-id="${order.order_id}">View</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });

         // Add event listener for the "View" button to pass orderId
         document.querySelectorAll('.order-list button[data-id]').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                window.location.href = `orderDetail.html?orderId=${orderId}`; // Pass orderId in URL
            });
        });
        
    } catch (error) {
        console.error('Error loading sales order data:', error);
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

document.addEventListener('DOMContentLoaded', loadOrderSRData);
