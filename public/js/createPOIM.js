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

document.getElementById("profile-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "profileIM.html";
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

async function fetchInventoryManager(userId) {
    try {
        const response = await fetch(`/api/inventory-manager/${userId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Inventory manager not found');
            }
            throw new Error('Network response was not ok');
        }
        const manager = await response.json();

        // Autofill the form fields with fetched data
        document.getElementById("company-name").value = "Brady Pharma";
        document.getElementById("company-address").value = manager.address || "Address not available";
        document.getElementById("requestor-name").value = manager.name || "Name not available";
        document.getElementById("requestor-position").value = "Inventory Manager";

        // Autofill the request date with the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        document.getElementById("request-date").value = currentDate;
    } catch (error) {
        console.error('Error fetching inventory manager info:', error);

        // Set default fallback values in case of an error
        document.getElementById("company-name").value = "";
        document.getElementById("company-address").value = "Address not available";
        document.getElementById("requestor-name").value = "Name not available";
        document.getElementById("requestor-position").value = "Position not available";
        document.getElementById("request-date").value = ""; // Clear the request date
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const userId = sessionStorage.getItem("userId"); // Retrieve userId from session storage
    if (userId) {
        fetchInventoryManager(userId); // Fetch inventory manager info using stored userId
    } else {
        console.error("User ID not found in session storage.");
    }
});



document.addEventListener("DOMContentLoaded", async () => {
    const supplierId = new URLSearchParams(window.location.search).get("supplierId");
    if (!supplierId) return console.warn("No supplier ID found in the URL.");

    const productInfoContainer = document.querySelector(".form-section-product-info");
    const sendBtn = document.querySelector(".send-btn");
    const addProductBtn = document.getElementById("add-product");
    const requestDateInput = document.getElementById("request-date");
    const requiredDateInput = document.getElementById("required-date");

    // Ensure "Required Date" is set to 1 month after "Request Date"
    requestDateInput.addEventListener("change", () => {
        const requestDate = new Date(requestDateInput.value);
        if (isNaN(requestDate)) return; // If the date is invalid, do nothing
        const requiredDate = new Date(requestDate);
        requiredDate.setMonth(requiredDate.getMonth() + 1); // Add 1 month
        requiredDateInput.value = requiredDate.toISOString().split("T")[0]; // Set in YYYY-MM-DD format
    });

    // Fetch products from the server
    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/suppliers/${supplierId}/products`);
            return response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Populate the product dropdown
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

    // Setup product event listeners
    const setupProductEventListeners = (productDropdown, quantityInput, unitPriceInput, totalPriceInput) => {
        productDropdown.addEventListener("change", () => {
            const unitPrice = parseFloat(productDropdown.selectedOptions[0]?.dataset.price) || 0;
            unitPriceInput.value = unitPrice ? `₱${unitPrice.toFixed(2)}` : ""; // Set unit price or clear it
            calculateTotalPrice();
        });

        quantityInput.addEventListener("input", calculateTotalPrice);

        function calculateTotalPrice() {
            const unitPrice = parseFloat(unitPriceInput.value.replace(/₱/, "")) || 0;
            const quantity = parseInt(quantityInput.value, 10) || 0;
            totalPriceInput.value = unitPrice && quantity ? `₱${(unitPrice * quantity).toFixed(2)}` : ""; // Only calculate if valid
        }
    };

    // Create a new product input group
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
            <button class="remove-product-btn">Remove Product</button>
        `;
        productInfoContainer.appendChild(productGroup);

        const newProductDropdown = productGroup.querySelector(".product-dropdown");
        await populateProductDropdown(newProductDropdown);

        setupProductEventListeners(
            newProductDropdown,
            productGroup.querySelector(".quantity-input"),
            productGroup.querySelector(".unit-price-output"),
            productGroup.querySelector(".total-price-output")
        );

        const removeButton = productGroup.querySelector(".remove-product-btn");
        removeButton.addEventListener("click", () => productGroup.remove());
    };

    await createProductGroup();
    addProductBtn.addEventListener("click", createProductGroup);

    sendBtn.addEventListener("click", async () => {
        const companyAddress = document.getElementById("company-address").value.trim();
        const requestorName = document.getElementById("requestor-name").value.trim();
        const requestorPosition = document.getElementById("requestor-position").value.trim();
        const requestDate = requestDateInput.value;
        const requiredDate = requiredDateInput.value;

        const productRows = Array.from(document.querySelectorAll(".product-group")).map(group => {
            const productDropdown = group.querySelector(".product-dropdown");
            const quantityInput = group.querySelector(".quantity-input");
            const unitPriceInput = group.querySelector(".unit-price-output");
            const totalPriceInput = group.querySelector(".total-price-output");

            const selectedProduct = productDropdown.selectedOptions[0];
            if (selectedProduct && selectedProduct.value) { // Ensure a valid product is selected
                return {
                    productId: selectedProduct.value,
                    productName: selectedProduct.textContent,
                    unitPrice: parseFloat(unitPriceInput.value.replace(/₱/, "")),
                    quantity: parseInt(quantityInput.value, 10),
                    totalPrice: parseFloat(totalPriceInput.value.replace(/₱/, ""))
                };
            }
        }).filter(Boolean); // Filter out invalid or incomplete product rows

        // Validate required fields
        if (!companyAddress || !requestorName || !requestorPosition || !requestDate || !requiredDate || productRows.length === 0) {
            alert("Please fill out all required fields and select valid products.");
            return;
        }

        const emailParams = {
            company_address: companyAddress,
            from_name: requestorName,
            requestor_position: requestorPosition,
            request_date: requestDate,
            required_date: requiredDate,
            order_details: productRows.map(row => `
                <tr>
                    <td>${row.productName}</td>
                    <td>₱${row.unitPrice}</td>
                    <td>${row.quantity}</td>
                    <td>₱${row.totalPrice}</td>
                </tr>
            `).join("")
        };

        try {
            await emailjs.send('service_skc39jp', 'template_ghl25dg', emailParams, 'mTGzRd_flL6wCKlxk');
            console.log('Email sent successfully.');

            const response = await fetch('/api/purchase-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    supplier_id: supplierId,
                    order_date: requestDate,
                    delivery_date: requiredDate,
                    order_address: companyAddress,
                    products: productRows,
                    status: 'Pending'
                })
            });

            if (response.ok) {
                alert('Purchase Order sent and saved successfully!');
            } else {
                console.error('Failed to save purchase order:', await response.json());
                alert('Failed to save Purchase Order. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
