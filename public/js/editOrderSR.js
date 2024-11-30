// Navigation Links Event Listeners
const links = [
    { id: "dashboard-link", url: "dashboardSR.html" },
    { id: "inventory-link", url: "inventorySR.html" },
    { id: "order-link", url: "orderSR.html" },
    { id: "customers-link", url: "customersSR.html" },
    { id: "profile-link", url: "profileSR.html" },
    { id: "back-link", url: "OrderSR.html" },
    { id: "cancel-edit-btn", url: "OrderSR.html" },
];

links.forEach(link => {
    document.getElementById(link.id)?.addEventListener("click", event => {
        event.preventDefault();
        window.location.href = link.url;
    });
});

// Format Date Helper Function
function formatDate(dateString) {
    const [month, day, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

// Populate Order Details
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
        fetch(`/api/order-details/${orderId}`)
            .then(response => response.json())
            .then(data => {
                if (data?.order) {
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
                    populateOrderItems(data.order_items);
                }
            })
            .catch(error => console.error('Error fetching order details:', error));
    }
});

function populateOrderItems(orderItems) {
    const itemsTable = document.getElementById('order-items-table').querySelector('tbody');
    let totalPrice = 0;

    // Clear existing rows to avoid duplication
    itemsTable.innerHTML = '';

    orderItems.forEach(item => {
        const row = document.createElement('tr');
        const quantity = parseFloat(item.quantity) || 0;
        const totalItemPrice = quantity > 0 ? (quantity * item.unit_price).toFixed(2) : '0.00'; // Only compute if quantity > 0
        row.innerHTML = `
            <td>${item.brand_name}</td> <!-- Display brand name -->
            <td>${item.product_name}</td>
            <td><input type="number" value="${item.quantity}" class="item-quantity" /></td>
            <td class="item-unit-price">${item.unit_price}</td>
            <td class="item-total-price">${item.total_price}</td>
            <td><button type="button" class="delete-item-btn">Delete</button></td>
            <!-- Hidden product_id and brand_id for easy access during form submission -->
            <input type="hidden" class="product-id" value="${item.product_id}" />
        `;
        itemsTable.appendChild(row);
        totalPrice += parseFloat(item.total_price);

         // Add event listeners for dynamic updates (quantity change)
         row.querySelector('.item-quantity').addEventListener('input', handleQuantityChange);
    });

    // Add event listeners for dynamic updates
    itemsTable.addEventListener('click', handleItemDelete);
}

function handleQuantityChange(event) {
    const target = event.target;
    const row = target.closest('tr');
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const unitPrice = parseFloat(row.querySelector('.item-unit-price').textContent) || 0; // Ensure unit price is used from the .item-unit-price cell
    const totalPrice = (quantity * unitPrice).toFixed(2); // Calculate the total price for the item

    // Update the total price cell for the item
    row.querySelector('.item-total-price').textContent = totalPrice;

    // Update the overall total price
    updateTotalPrice();
}

function handleItemDelete(event) {
    if (event.target.classList.contains('delete-item-btn')) {
        event.target.closest('tr').remove();
        updateTotalPrice();
    }
}

function updateTotalPrice() {
    const total = Array.from(document.querySelectorAll('.item-total-price')).reduce((sum, cell) => {
        return sum + parseFloat(cell.textContent || '0');
    }, 0);
}





// Submit Edited Order
document.getElementById('edit-order-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const orderId = new URLSearchParams(window.location.search).get('orderId');
    const items = Array.from(document.querySelectorAll('#order-items-table tbody tr')).map(row => ({
        product_id: row.querySelector('.product-id').value,
        quantity: row.querySelector('.item-quantity').value,
        unit_price: row.querySelector('.item-unit-price').value,
        total_price: row.querySelector('.item-total-price').textContent
    }));

    const updatedData = {
        customer_id: document.getElementById('customer-id').value,
        customer_contact: document.getElementById('customer-contact').value,
        customer_email: document.getElementById('customer-email').value,
        payment_ref_num: document.getElementById('customer-payment-ref').value,
        delivery_date: document.getElementById('delivery-date').value,
        order_address: document.getElementById('order-address').value,
        barangay: document.getElementById('delivery-barangay').value,
        city: document.getElementById('delivery-city').value,
        order_receiver: document.getElementById('delivery-receiver').value,
        salesRepId: document.getElementById('sales-rep-id').value,
        orderItems: items
    };

    fetch(`/api/edit-order/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
        .then(response => response.json())
        .then(() => {
            alert('Order updated successfully!');
            window.location.href = `/orderDetail.html?orderId=${orderId}`;
        })
        .catch(error => console.error('Error updating order:', error));
});
