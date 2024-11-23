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
    // Retrieve the supplierId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const supplierId = urlParams.get("supplierId");
    console.log("Supplier ID:", supplierId);

    const productDropdown = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");
    const unitPriceInput = document.getElementById("unit-price");
    const totalPriceInput = document.getElementById("total-price");

    // Ensure the supplierId is present
    if (supplierId) {
        try {
            // Fetch supplier details (optional, for display purposes)
            const supplierResponse = await fetch(`/api/suppliers/${supplierId}`);
            const supplier = await supplierResponse.json();

            if (supplier) {
                console.log("Supplier details fetched:", supplier);
                // You can display supplier details here if needed
                // Example: document.getElementById("supplier-name").textContent = supplier.supplier_name;
            }

            // Fetch and populate products based on the supplier
            const productResponse = await fetch(`/api/suppliers/${supplierId}/products`);
            const products = await productResponse.json();

            if (products && Array.isArray(products)) {
                console.log("Products fetched:", products);
            
                // Populate the product dropdown
                productDropdown.innerHTML = '<option value="">-- Select Product --</option>';
                products.forEach(product => {
                    const option = document.createElement("option");
                    
                    // Use Category - Name format for the dropdown
                    option.value = product.product_id;
                    option.dataset.price = product.selling_price;
                    option.textContent = `${product.product_category} - ${product.product_name}`; // Include category in display
                    
                    productDropdown.appendChild(option);
                });
                productDropdown.disabled = false;
            
            } else {
                console.warn("No products found for the supplier.");
            }
        } catch (error) {
            console.error("Error fetching supplier or product details:", error);
        }
    } else {
        console.warn("No supplierId provided in the URL.");
    }

    // Event Listener: Update unit price and total price when a product is selected
    productDropdown.addEventListener("change", () => {
        const selectedOption = productDropdown.options[productDropdown.selectedIndex];
        if (selectedOption) {
            const unitPrice = parseFloat(selectedOption.dataset.price) || 0;
            console.log("Selected product price:", unitPrice);
            unitPriceInput.value = `₱${unitPrice.toFixed(2)}`;
            calculateTotalPrice();
        } else {
            unitPriceInput.value = "";
            totalPriceInput.value = "";
        }
    });

    // Event Listener: Update total price when quantity changes
    quantityInput.addEventListener("input", () => {
        calculateTotalPrice();
    });

    // Function: Calculate the total price
    function calculateTotalPrice() {
        const selectedOption = productDropdown.options[productDropdown.selectedIndex];
        const unitPrice = selectedOption ? parseFloat(selectedOption.dataset.price) || 0 : 0;
        const quantity = parseInt(quantityInput.value, 10) || 0;
        const totalPrice = unitPrice * quantity;

        console.log(`Calculating total: Unit Price = ${unitPrice}, Quantity = ${quantity}, Total = ${totalPrice}`);
        totalPriceInput.value = `₱${totalPrice.toFixed(2)}`;
    }


    const addProductBtn = document.getElementById("add-product");
    const productInfoContainer = document.querySelector(".form-section-product-info");

    // Add event listener for Add Product button
    addProductBtn.addEventListener("click", () => {
        // Create a new product info group
        const productGroup = document.createElement("div");
        productGroup.classList.add("product-group");

        // Add the necessary fields for the new product
        productGroup.innerHTML = `
            <div class="form-group">
                <label for="product">Select Product:</label>
                <select class="product-dropdown">
                    <option value="">-- Select Product --</option>
                </select>
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

        // Append the new product group to the product info container
        productInfoContainer.appendChild(productGroup);

        // Populate the product dropdown for this new product group
        const productDropdown = productGroup.querySelector(".product-dropdown");
        populateProductDropdown(productDropdown);

        // Add event listeners for this new product group
        setupProductEventListeners(productGroup);
    });

        

    // Function to populate the product dropdown
    async function populateProductDropdown(productDropdown) {
        try {
            const supplierId = new URLSearchParams(window.location.search).get("supplierId");
            if (!supplierId) {
                console.error("Supplier ID not found.");
                return;
            }

            const response = await fetch(`/api/suppliers/${supplierId}/products`);
            const products = await response.json();

            if (products && Array.isArray(products)) {
                console.log("Products fetched:", products);

                // Populate the product dropdown
                productDropdown.innerHTML = '<option value="">-- Select Product --</option>';
                products.forEach(product => {
                    const option = document.createElement("option");
                    option.value = product.product_id;
                    option.dataset.price = product.selling_price;
                    option.textContent = `${product.product_category} - ${product.product_name}`;
                    productDropdown.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }


    function setupProductEventListeners(productGroup) {
        const productDropdown = productGroup.querySelector(".product-dropdown");
        const quantityInput = productGroup.querySelector(".quantity-input");
        const unitPriceOutput = productGroup.querySelector(".unit-price-output");
        const totalPriceOutput = productGroup.querySelector(".total-price-output");

        // Update unit price and total price when product is selected
        productDropdown.addEventListener("change", () => {
            const selectedOption = productDropdown.options[productDropdown.selectedIndex];
            if (selectedOption) {
                const unitPrice = parseFloat(selectedOption.dataset.price) || 0;
                unitPriceOutput.value = unitPrice.toFixed(2);
                calculateTotalPrice();
            }
        });

        // Update total price when quantity changes
        quantityInput.addEventListener("input", () => {
            calculateTotalPrice();
        });

        // Function to calculate total price
        function calculateTotalPrice() {
            const unitPrice = parseFloat(unitPriceOutput.value) || 0;
            const quantity = parseInt(quantityInput.value, 10) || 0;
            const totalPrice = unitPrice * quantity;
            totalPriceOutput.value = totalPrice.toFixed(2);
        }
    }


});
