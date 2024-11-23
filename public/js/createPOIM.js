document.getElementById("home-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardIM.html"; // Redirect to the inventory page
});

// Select the Inventory link by its ID
document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventoryIM.html"; // Redirect to the inventory page
});

document.getElementById("sales-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "salesOrderIM.html"; // Redirect to the inventory page
});

// Select the Inventory link by its ID
document.getElementById("suppliers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "suppliersIM.html"; // Redirect to the inventory page
});

document.getElementById("back-link").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default action of the link

    // Retrieve the supplier ID from the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const supplierId = urlParams.get("supplierId");

    if (supplierId) {
        // Redirect to the createPOIM page with the supplier ID as a query parameter
        console.log(`Redirecting to createPOIM.html with supplierId=${supplierId}`);
        window.location.href = `SupplierDetailsIM.html?supplierId=${supplierId}`;
    } else {
        console.warn("Supplier ID is missing. Cannot proceed to create PO.");
        alert("No supplier selected. Please select a supplier first.");
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const supplierId = new URLSearchParams(window.location.search).get("supplierId");
    if (!supplierId) return console.warn("No supplier ID found in the URL.");

    const productInfoContainer = document.querySelector(".form-section-product-info");
    const sendBtn = document.querySelector(".send-btn");
    const addProductBtn = document.getElementById("add-product");

    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/suppliers/${supplierId}/products`);
            return response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const populateProductDropdown = async (productDropdown) => {
        const products = await fetchProducts();
        if (products) {
            productDropdown.innerHTML = '<option value="">-- Select Product --</option>';
            products.forEach(({ product_id, selling_price, product_category, product_name }) => {
                const option = document.createElement("option");
                option.value = product_id;
                option.dataset.price = selling_price;
                option.textContent = `${product_category} - ${product_name}`;
                productDropdown.appendChild(option);
            });
        }
    };

    const setupProductEventListeners = (productDropdown, quantityInput, unitPriceInput, totalPriceInput) => {
        productDropdown.addEventListener("change", () => {
            const unitPrice = parseFloat(productDropdown.selectedOptions[0]?.dataset.price) || 0;
            unitPriceInput.value = `₱${unitPrice.toFixed(2)}`;
            calculateTotalPrice();
        });

        quantityInput.addEventListener("input", calculateTotalPrice);

        function calculateTotalPrice() {
            const unitPrice = parseFloat(unitPriceInput.value.replace(/₱/, "")) || 0;
            const quantity = parseInt(quantityInput.value, 10) || 0;
            totalPriceInput.value = `₱${(unitPrice * quantity).toFixed(2)}`;
        }
    };

    const createProductGroup = async () => {
        const productGroup = document.createElement("div");
        productGroup.classList.add("product-group");
        productGroup.innerHTML = `
            <div class="form-group">
                <label for="product">Select Product:</label>
                <select class="product-dropdown"><option value="">-- Select Product --</option></select>
            </div>
            <div class="form-group">
                <label for="quantity">Quantity:</label>
                <input type="number" class="quantity-input" placeholder="Quantity" min="500" value="500">
            </div>
            <div class="form-group">
                <label for="unit-price">Unit Price:</label>
                <input type="text" class="unit-price-output" placeholder="Unit Price" readonly>
            </div>
            <div class="form-group">
                <label for="total-price">Total Price:</label>
                <input type="text" class="total-price-output" placeholder="Total Price" readonly>
            </div>
        `;
        productInfoContainer.appendChild(productGroup);

        const newProductDropdown = productGroup.querySelector(".product-dropdown");
        await populateProductDropdown(newProductDropdown);

        setupProductEventListeners(newProductDropdown, productGroup.querySelector(".quantity-input"), 
                                   productGroup.querySelector(".unit-price-output"), productGroup.querySelector(".total-price-output"));
    };

    // Initial Product Group Creation
    await createProductGroup();

    // Add Product Button Click Handler
    addProductBtn.addEventListener("click", createProductGroup);

    // Send Button Click Handler
    sendBtn.addEventListener("click", async () => {
        const companyAddress = document.getElementById("company-address").value;
        const requestorName = document.getElementById("requestor-name").value;
        const requestorPosition = document.getElementById("requestor-position").value;
        const requestDate = document.getElementById("request-date").value;
        const requiredDate = document.getElementById("required-date").value;
    
        const productRows = Array.from(document.querySelectorAll(".product-group")).map(group => {
            const productDropdown = group.querySelector(".product-dropdown");
            const quantityInput = group.querySelector(".quantity-input");
            const unitPriceInput = group.querySelector(".unit-price-output");
            const totalPriceInput = group.querySelector(".total-price-output");
    
            const selectedProduct = productDropdown.selectedOptions[0];
            if (selectedProduct) {
                return {
                    productName: selectedProduct.textContent,
                    productPrice: unitPriceInput.value,
                    quantity: quantityInput.value,
                    totalPrice: totalPriceInput.value
                };
            }
        }).filter(Boolean);
    
        // Generate rows for each product in the order
        const orderDetails = productRows.map(row => `
            <tr>
                <td>${row.productName}</td>
                <td>${row.productPrice}</td>
                <td>${row.quantity}</td>
                <td>${row.totalPrice}</td>
            </tr>
        `).join("");  // Join all rows into a single string
    
        const emailParams = {
            company_address: companyAddress,
            from_name: requestorName,
            requestor_position: requestorPosition,
            request_date: requestDate,
            required_date: requiredDate,
            order_details: `
                <h3>Order Details</h3>
                <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails} <!-- Insert all product rows here -->
                    </tbody>
                </table>
            `
        };
        
    
        try {
            const response = await emailjs.send('service_skc39jp', 'template_ghl25dg', emailParams, 'mTGzRd_flL6wCKlxk');
            console.log('Email sent successfully:', response);
            alert('Purchase Order sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send Purchase Order. Please try again.');
        }
    });
});
