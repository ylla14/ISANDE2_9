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
      
        if (salesRepInfo.order_date) {
            const orderDate = new Date(salesRepInfo.order_date).toISOString().split('T')[0]; 
            document.getElementById("sales-rep-date").textContent = orderDate; // Display the date
        } else {
            document.getElementById("sales-rep-date").textContent = "Date not available";
        }
    } catch (error) {
        console.error('Error fetching sales representative info:', error);
        document.getElementById("sales-rep-code").textContent = "Sales representative information is not available.";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const orderItemsContainer = document.getElementById("order-items");
    const addItemButton = document.querySelector(".add-item");

    addItemButton.addEventListener("click", function () {

        const itemCard = document.createElement("div");
        itemCard.classList.add("order-row", "item-card");


        const qtyLabel = document.createElement("label");
        qtyLabel.innerHTML = 'Qty: <input type="number" class="qty-input" />';
        itemCard.appendChild(qtyLabel);


        const descriptionLabel = document.createElement("label");
        descriptionLabel.innerHTML = `
            Product Description:
            <select class="brand-name">
                <option value="">Select Brand Name</option>
                <!-- Populate options here if needed -->
            </select>
            <select class="category-name">
                <option value="">Select Category Name</option>
                <!-- Populate options here if needed -->
            </select>
            <select class="product-name">
                <option value="">Select Product Name</option>
                <!-- Populate options here if needed -->
            </select>`;
        itemCard.appendChild(descriptionLabel);


        const unitPriceLabel = document.createElement("label");
        unitPriceLabel.innerHTML = 'Unit Price: <input type="text" class="unit-price-input" />';
        itemCard.appendChild(unitPriceLabel);


        const totalPriceLabel = document.createElement("label");
        totalPriceLabel.innerHTML = 'Total Price: <input type="text" class="total-price-input" />';
        itemCard.appendChild(totalPriceLabel);

        orderItemsContainer.appendChild(itemCard);
    });
});
