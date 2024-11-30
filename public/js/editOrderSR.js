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
                    let totalPrice = 0; // Initialize total price
                    if (data.order_items && data.order_items.length > 0) {
                        data.order_items.forEach(item => {
                            const row = document.createElement('tr');
                            row.innerHTML = `<td>${item.product_name}</td><td>${item.quantity}</td><td>${item.unit_price}</td><td>${item.total_price}</td>`;
                            itemsTable.appendChild(row);
                            // Ensure total_price is treated as a number
                            totalPrice += parseFloat(item.total_price) || 0; // Handle cases where total_price is not a valid number
                        });
                        document.getElementById('overall-total-price').textContent = totalPrice.toFixed(2); // Display the total
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

document.getElementById('edit-order-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const orderId = new URLSearchParams(window.location.search).get('orderId');
    const updatedData = {

        customer_id: document.getElementById('customer-id').value,
        customer_name: document.getElementById('customer-name').value,
        customer_contact: document.getElementById('customer-contact').value,
        customer_email: document.getElementById('customer-email').value,
        payment_ref_num: document.getElementById('customer-payment-ref').value,
        delivery_date: formatDate(document.getElementById('delivery-date').value), 
        order_address: document.getElementById('order-address').value,
        barangay: document.getElementById('delivery-barangay').value,
        city: document.getElementById('delivery-city').value,
        order_receiver: document.getElementById('delivery-receiver').value,
        salesRepId : document.getElementById('sales-rep-id').value,
    };

    fetch(`/api/edit-order/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    })
        .then(response => response.json())
        .then(result => {
            alert('Order updated successfully!');
            window.location.href = `/orderDetail.html?orderId=${orderId}`;
        })
        .catch(error => console.error('Error updating order:', error));
});