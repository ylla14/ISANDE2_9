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


document.addEventListener("DOMContentLoaded", function () {
    const orderItemsContainer = document.getElementById("order-items");
    const addItemButton = document.querySelector(".add-item");

    // Function to delete an order item
    function deleteOrderItem(button) {
        const itemCard = button.closest(".item-card");
        if (itemCard) {
            itemCard.remove();
        }
    }

    // Add this function to global scope to make it accessible from inline HTML
    window.deleteOrderItem = deleteOrderItem;


    addItemButton.addEventListener("click", function () {

        // Create the new item card
        const itemCard = document.createElement("div");
        itemCard.classList.add("order-row", "item-card");

        // Create Qty label and input
        const qtyLabel = document.createElement("label");
        qtyLabel.innerHTML = 'Qty: <input type="number" class="qty-input" />';
        itemCard.appendChild(qtyLabel);

        // Create Product Description with Brand and Product dropdowns
        const descriptionLabel = document.createElement("label");
        descriptionLabel.innerHTML = `
            Product Description:
            <select class="brand-name">
                <option value="">Select Brand Name</option>
                <!-- Brands will be populated here -->
            </select>
            <select class="product-name">
                <option value="">Select Product Name</option>
                <!-- Products will be populated here based on selected brand -->
            </select>`;
        itemCard.appendChild(descriptionLabel);

        // Create Unit Price label and input
        const unitPriceLabel = document.createElement("label");
        unitPriceLabel.innerHTML = 'Unit Price: <input type="text" class="unit-price-input" readonly />';
        itemCard.appendChild(unitPriceLabel);

        // Create Total Price label and input
        const totalPriceLabel = document.createElement("label");
        totalPriceLabel.innerHTML = 'Total Price: <input type="text" class="total-price-input" readonly />';
        itemCard.appendChild(totalPriceLabel);

         // Create Delete Button
         const deleteButton = document.createElement("button");
         deleteButton.classList.add("delete-button");
         deleteButton.textContent = "Delete";
         deleteButton.onclick = function() { deleteOrderItem(deleteButton); };
         itemCard.appendChild(deleteButton);

        // Add the item card to the order items container
        orderItemsContainer.appendChild(itemCard);

        // Now, populate the brand dropdown for this new item card
        const brandSelect = itemCard.querySelector('.brand-name');
        const productSelect = itemCard.querySelector('.product-name');

        // Fetch and populate brands for the new row
        fetch('/api/brands')
            .then(response => response.json())
            .then(data => {
                data.forEach(brand => {
                    const option = document.createElement('option');
                    option.value = brand.supplier_id;
                    option.textContent = brand.supplier_name;
                    brandSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching brands:', error));

        // Add event listener to brand dropdown to fetch products when brand is selected
        brandSelect.addEventListener('change', () => {
            const supplierId = brandSelect.value;

            // Clear the product dropdown
            productSelect.innerHTML = '<option value="">Select Product Name</option>';

            if (supplierId) {
                fetch(`/api/products/${supplierId}`)
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

        // Add event listener to product dropdown to update unit price and calculate total price
        productSelect.addEventListener('change', () => {
            const productId = productSelect.value;
            const unitPriceInput = itemCard.querySelector('.unit-price-input');
            const qtyInput = itemCard.querySelector('.qty-input');
            const totalPriceInput = itemCard.querySelector('.total-price-input');

            if (productId) {
                fetch(`/api/products/${brandSelect.value}`)
                    .then(response => response.json())
                    .then(products => {
                        const product = products.find(p => p.product_id === productId);
                        if (product) {
                            const sellingPrice = parseFloat(product.selling_price);
                            if (!isNaN(sellingPrice)) {
                                unitPriceInput.value = sellingPrice.toFixed(2);
                                calculateTotalPrice(); // Calculate total price when product is selected
                            }
                        }
                    })
                    .catch(error => console.error('Error fetching product details:', error));
            }

            function calculateTotalPrice() {
                const quantity = parseFloat(qtyInput.value) || 0; // Default to 0 if not a number
                const unitPrice = parseFloat(unitPriceInput.value) || 0;
                const totalPrice = (quantity * unitPrice).toFixed(2);
                totalPriceInput.value = totalPrice; // Update total price input
            }
        });

        // Handle qty input change to update the total price
        itemCard.querySelector('.qty-input').addEventListener('input', () => {
            const qtyInput = itemCard.querySelector('.qty-input');
            const unitPriceInput = itemCard.querySelector('.unit-price-input');
            const totalPriceInput = itemCard.querySelector('.total-price-input');
            const quantity = parseFloat(qtyInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            const totalPrice = (quantity * unitPrice).toFixed(2);
            totalPriceInput.value = totalPrice;
        });
    });
});




document.addEventListener('DOMContentLoaded', () => {
    // Fetch the Order ID and populate the customer and order details
    const form = document.querySelector('.order-form');
    const submitButton = document.querySelector('.submit-button');
    
    submitButton.addEventListener('click', () => {
        // Get the values from the form
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
