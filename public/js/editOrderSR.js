// Navigation Links
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

document.getElementById("back-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "OrderSR.html"; // Redirect to the inventory page
});

document.getElementById("cancel-edit-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "OrderSR.html"; // Redirect to the inventory page
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
        fetch(`/api/order-details/${orderId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.order) {
                    const formattedDeliveryDate = new Date(data.order.delivery_date).toLocaleDateString();
                    
                    // Populate sales representative details
                    document.getElementById('order-title').textContent = `ORD00${data.order.order_id}`;
                    document.getElementById('sales-rep-id').value = data.order.sales_rep_id;
                    document.getElementById('sales-rep-name').value = data.order.sales_rep_name;
                    document.getElementById('sales-rep-contactinfo').value = data.order.sales_rep_contactinfo;

                    // Populate customer details
                    document.getElementById('customer-id').value = data.order.customer_id;
                    document.getElementById('customer-name').value = `${data.order.customer_first_name} ${data.order.customer_last_name}`;
                    document.getElementById('customer-contact').value = data.order.customer_contact;
                    document.getElementById('customer-email').value = data.order.customer_email;
                    document.getElementById('customer-payment-ref').value = data.order.payment_ref_num;

                    // Populate delivery details
                    document.getElementById('delivery-date').value = formattedDeliveryDate;
                    document.getElementById('order-address').value = data.order.order_address;
                    document.getElementById('delivery-barangay').value = data.order.barangay;
                    document.getElementById('delivery-city').value = data.order.city;
                    document.getElementById('delivery-receiver').value = data.order.order_receiver;

                    // Populate order items
                    const itemsTable = document.getElementById('order-items-table');
                    let totalPrice = 0;
                    if (data.order_items && data.order_items.length > 0) {
                        data.order_items.forEach(item => {
                            const row = document.createElement('tr');
                            row.innerHTML = `<td>${item.product_name}</td><td>${item.quantity}</td><td>${item.unit_price}</td><td>${item.total_price}</td>`;
                            itemsTable.appendChild(row);
                            totalPrice += parseFloat(item.total_price) || 0; // Handle cases where total_price is not a valid number
                        });
                        document.getElementById('overall-total-price').textContent = totalPrice.toFixed(2);
                    } else {
                        console.log("No order items found.");
                    }
                }
            });
    }
});

function formatDate(dateString) {
    const [month, day, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

// Enable editing for Order Details
document.getElementById("edit-order-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const orderItems = document.querySelectorAll("#order-items-table tr");
    orderItems.forEach(row => {
        const inputs = row.querySelectorAll("input");
        inputs.forEach(input => {
            input.readOnly = false; // Make fields editable
        });
    });

    // Show Save button if necessary
    document.querySelector(".submit-button").style.display = "inline-block";
});

// Save updated Order Details
document.querySelector(".submit-button").addEventListener("click", function (event) {
    event.preventDefault();

    const updatedOrderItems = [];
    const rows = document.querySelectorAll("#order-items-table tr");

    rows.forEach(row => {
        const productName = row.querySelector(".order-product-name").value;
        const quantity = parseFloat(row.querySelector(".order-quantity").value);
        const unitPrice = parseFloat(row.querySelector(".order-unit-price").value);

        const totalPrice = quantity * unitPrice;

        updatedOrderItems.push({
            product_name: productName,
            quantity: quantity,
            unit_price: unitPrice,
            total_price: totalPrice,
        });

        // Update Total Price in the table
        row.querySelector(".order-total-price").value = totalPrice.toFixed(2);

        // Disable editing after saving
        const inputs = row.querySelectorAll("input");
        inputs.forEach(input => {
            input.readOnly = true;
        });
    });

    // Update the overall total price
    const overallTotal = updatedOrderItems.reduce((sum, item) => sum + item.total_price, 0);
    document.getElementById("overall-total-price").textContent = overallTotal.toFixed(2);

    // Send updated data to the backend
    fetch("/api/update-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedOrderItems }),
    })
        .then(response => {
            if (response.ok) {
                alert("Order details updated successfully!");
            } else {
                alert("Error updating order details.");
            }
        })
        .catch(error => console.error("Error:", error));
});


// Enable editing for order items
document.getElementById('editOrderBtn').addEventListener('click', () => {
    const rows = document.querySelectorAll('#order-items-table tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            if (index < 3) { // Exclude the Total Price column from editing
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cell.textContent.trim();
                cell.textContent = '';
                cell.appendChild(input);
            }
        });
    });

    document.getElementById('saveOrderBtn').style.display = 'inline-block';
});

// Save updated order items
document.getElementById('saveOrderBtn').addEventListener('click', () => {
    const rows = document.querySelectorAll('#order-items-table tr');
    const updatedItems = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const item = {
            product_name: cells[0].querySelector('input').value,
            quantity: parseFloat(cells[1].querySelector('input').value),
            unit_price: parseFloat(cells[2].querySelector('input').value),
        };
        item.total_price = item.quantity * item.unit_price;
        updatedItems.push(item);

        cells[0].textContent = item.product_name;
        cells[1].textContent = item.quantity;
        cells[2].textContent = item.unit_price.toFixed(2);
        cells[3].textContent = item.total_price.toFixed(2);
    });

    document.getElementById('saveOrderBtn').style.display = 'none';

    fetch('/api/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedItems }),
    }).then(response => {
        if (response.ok) {
            alert('Order updated successfully!');
        } else {
            alert('Error updating order.');
        }
    });
});
