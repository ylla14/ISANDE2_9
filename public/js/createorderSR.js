document.getElementById("dashboard-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardSR.html"; // Redirect to the dashboard page
});

document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventorySR.html"; // Redirect to the inventory page
});

document.getElementById("order-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "orderSR.html"; // Redirect to the order page
});

document.getElementById("customers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "customersSR.html"; // Redirect to the customers page
});
document.getElementById("profile-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "profileSR.html";
});

document.addEventListener("DOMContentLoaded", function() {
    const userId = sessionStorage.getItem("userId"); // Retrieve userId from session storage
    if (userId) {
        fetchSalesRepInfo(userId); // Fetch sales rep info using stored userId
    } else {
        console.error("User ID not found in session storage.");
        document.getElementById("sales-rep-code").textContent = "Sales representative information is not available.";
    }

    // Display the current date
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    document.getElementById("sales-rep-date").textContent = currentDate; // Display the current date
});

async function fetchSalesRepInfo(userId) {
    try {
        const response = await fetch(`/api/sales-representative/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const salesRepInfo = await response.json();
        
        document.getElementById("sales-rep-code").textContent = salesRepInfo.sales_rep_id ? salesRepInfo.sales_rep_id + " " : "ID not available";
        document.getElementById("sales-rep-name").textContent = salesRepInfo.name ? salesRepInfo.name + " " : "Name not available";
      
        const currentDate = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = currentDate.toLocaleDateString(undefined, options).split('/').reverse().join('-'); // Format as YYYY-MM-DD
        document.getElementById("sales-rep-date").textContent = formattedDate; // Display the current date
   
    } catch (error) {
        console.error('Error fetching sales representative info:', error);
        document.getElementById("sales-rep-code").textContent = "Sales representative information is not available.";
    }
}


// Modify the 'blur' event for last name input to handle both existing and new customers
document.querySelector('.last-name-input').addEventListener('blur', function() {
    const lastName = this.value;
    if (lastName) {
        fetch(`/api/customers/${lastName}`)
            .then(response => {
                if (!response.ok) throw new Error('Customer not found');
                return response.json();
            })
            .then(data => {
                // If customer found, fill the form fields
                document.querySelector('.customer-code-input').value = data.customer_id;
                document.querySelector('.first-name-input').value = data.fname;
                document.querySelector('.contact-number-input').value = data.contact_num;
                document.querySelector('.email-address-input').value = data.email;
            })
            .catch(error => {
                console.error('Error fetching customer:', error);
                // If customer not found, generate a new customer ID and fill in empty fields
                fetch('/api/generate-new-customer-id')
                    .then(response => response.json())
                    .then(data => {
                        // Use the newly generated customer ID
                        document.querySelector('.customer-code-input').value = data.newCustomerId;
                        document.querySelector('.first-name-input').value = '';
                        document.querySelector('.contact-number-input').value = '';
                        document.querySelector('.email-address-input').value = '';
                    })
                    .catch(error => console.error('Error generating new customer ID:', error));
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.querySelector('.add-item');
    const orderItemsContainer = document.getElementById('order-items');

        // Function to delete an order item
        function deleteOrderItem(button) {
            const itemCard = button.closest(".item-card");
            if (itemCard) {
                itemCard.remove();
            }
        }
    
        // Add this function to global scope to make it accessible from inline HTML
        window.deleteOrderItem = deleteOrderItem;

    addItemButton.addEventListener('click', () => {
        // Clone the existing product card as a template
        const newItemCard = document.getElementById('product-card').cloneNode(true);

        // Clear input values in the new item card
        newItemCard.querySelector('.qty-input').value = '';
        newItemCard.querySelector('.unit-price-input').value = '';
        newItemCard.querySelector('.total-price-input').value = '';
        newItemCard.querySelector('.brand-name').value = '';
        newItemCard.querySelector('.product-name').innerHTML = '<option value="">Select Product Name</option>';
        newItemCard.style.backgroundColor = '';

        // Add the new item card to the container
        orderItemsContainer.appendChild(newItemCard);

        // Attach event listeners to the new item card
        const qtyInput = newItemCard.querySelector('.qty-input');
        const unitPriceInput = newItemCard.querySelector('.unit-price-input');
        const totalPriceInput = newItemCard.querySelector('.total-price-input');
        const brandSelect = newItemCard.querySelector('.brand-name');
        const productSelect = newItemCard.querySelector('.product-name');
        const productCard = document.getElementById('product-card');


        // Reuse existing event listeners for calculating total price
        qtyInput.addEventListener('input', () => {
            const quantity = parseFloat(qtyInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            totalPriceInput.value = (quantity * unitPrice).toFixed(2);
        });

        // Fetch products when a new brand is selected
        brandSelect.addEventListener('change', () => {
            const supplierId = brandSelect.value;

            // Clear product dropdown
            productSelect.innerHTML = '<option value="">Select Product Name</option>';

            if (supplierId) {
                fetch(`/api/suppliers/${supplierId}/products`)
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(product => {
                            const option = document.createElement('option');
                            option.value = product.product_id;
                            option.textContent = product.product_name;
                            productSelect.appendChild(option);
                        });
                    })
                    .catch(error => console.error('Error fetching products:', error));
            }
        });

        // Check stock level and expiration date when a product is selected
productSelect.addEventListener('change', () => {
    const productId = productSelect.value;

    if (productId) {
        fetch(`/api/product-details/${productId}`) // Fetch product details including stock level and expiration date
            .then(response => response.json())
            .then(product => {
                // Store product details in a variable for reuse
                window.currentProduct = {
                    stockLevel: product.current_stock_level, // Numeric stock level
                    expirationStatus: product.expiry_status,
                    stockStatus: product.stock_status
                };

                updatenewItemCard(); // Update the card based on the current state
            })
            .catch(error => console.error('Error fetching product details:', error));
    }
});

// Update the product card based on conditions
function updatenewItemCard() {
    const { stockLevel = 0, expirationStatus = '', stockStatus = '' } = window.currentProduct || {};
    const orderQuantity = parseInt(qtyInput.value) || 0;

    // Check if order quantity exceeds current stock level
    if (orderQuantity > stockLevel) {
        // Quantity exceeds stock: orange color
        newItemCard.style.backgroundColor = '#FFA07A';
    } 
    // Check both conditions
    else if (expirationStatus === "Near Expiry" && stockStatus === "Low Stock") {
        // Both: blue color
        newItemCard.style.backgroundColor = '#ADD8E6';
    } 
    // Check individual conditions
    else if (expirationStatus === "Near Expiry") {
        // Near expiry: yellow color
        newItemCard.style.backgroundColor = '#FFEE8C';
    } 
    else if (stockStatus === "Low Stock") {
        // Low Stock: red color
        newItemCard.style.backgroundColor = '#FF7F7F';
    } 
    // Reset to default color for all other cases
    else {
        newItemCard.style.backgroundColor = '';
    }
}

// Add event listener to qtyInput to recheck conditions dynamically
qtyInput.addEventListener('input', () => {
    updatenewItemCard(); // Dynamically check conditions when quantity changes
});

        

        // Fetch unit price when a new product is selected
        productSelect.addEventListener('change', () => {
            const productId = productSelect.value;

            if (productId) {
                fetch(`/api/products/${productId}`)
                    .then(response => response.json())
                    .then(product => {
                        const sellingPrice = parseFloat(product.selling_price);
                        if (!isNaN(sellingPrice)) {
                            unitPriceInput.value = sellingPrice.toFixed(2);
                            const quantity = parseFloat(qtyInput.value) || 0;
                            totalPriceInput.value = (quantity * sellingPrice).toFixed(2);
                        }
                    })
                    .catch(error => console.error('Error fetching product details:', error));
            }
        });
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const purchasedDateInput = document.getElementById('purchased-date');
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    purchasedDateInput.value = today;

    // Fetch the Order ID and populate the customer and order details
    const form = document.querySelector('.order-form');
    const submitButton = document.querySelector('.submit-button');
    
    submitButton.addEventListener('click', () => {
        // Get the values from the form
        const purchasedDate = purchasedDateInput.value;

        const nearExpiryAccepted = document.getElementById('near-expiry-accepted').checked;

        sessionStorage.setItem('nearExpiryAccepted', nearExpiryAccepted);
        
        const customerCode = document.querySelector('.customer-code-input').value;
        const firstName = document.querySelector('.first-name-input').value;
        const lastName = document.querySelector('.last-name-input').value;
        const contactNumber = document.querySelector('.contact-number-input').value;
        const emailAddress = document.querySelector('.email-address-input').value;
        const paymentRefNum = document.querySelector('input[placeholder="Payment Reference Number"]').value;
        
        const deliveryDate = document.querySelector('.delivery-details input[type="date"]').value;
        const order_address = document.querySelector('.delivery-details input[placeholder="Order Address"]').value;
        const city = document.querySelector('.delivery-details input[placeholder="City"]').value;
        const barangay = document.querySelector('.delivery-details input[placeholder="Barangay"]').value;
        const orderReceiver = document.querySelector('.delivery-details input[placeholder="Order Receiver"]').value;
        
        const salesRepId = document.getElementById("sales-rep-code").textContent.trim(); // Ensure no extra spaces


        // Capture the order items (product, quantity, unit price, total price)
        const orderItems = [];
        const orderRows = document.querySelectorAll('.order-row');
        orderRows.forEach(row => {
            const qty = row.querySelector('.qty-input').value;
            const productSelect = row.querySelector('.product-name');
            const productId = productSelect.value;  // Correctly define productId here
            const productName = productSelect.options[productSelect.selectedIndex].text;  // Get the selected product name
            const unitPrice = row.querySelector('.unit-price-input').value;
            const totalPrice = row.querySelector('.total-price-input').value;
            
            orderItems.push({
                product_id: productId,  // Now productId is correctly defined
                product_name: productName,
                quantity: qty,
                unit_price: unitPrice,
                total_price: totalPrice
            });
        });

        // Create the order payload
        const orderData = {
            purchased_date: purchasedDate,
            customer_code: customerCode,
            first_name: firstName,
            last_name: lastName,
            contact_number: contactNumber,
            email_address: emailAddress,
            payment_ref_num: paymentRefNum,
            delivery_date: deliveryDate,
            order_address: order_address,
            city: city,
            barangay: barangay,
            order_receiver: orderReceiver,
            sales_rep_id: salesRepId,
            order_items: orderItems
        };

        // Send the order data to the server
        fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data); // Add this to check the response structure
            if (data.success) {
                alert('Order has been successfully created');
                window.location.href = 'orderSR.html';
            } else {
                alert('Error creating the order: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create order');
        });        
    });
});

