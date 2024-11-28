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

document.getElementById("back-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventoryIM.html"; // Redirect to the inventory page
});


document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    if (productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

            if (product) {
                document.getElementById("title").value = product.product_name;
                document.getElementById("category").value = product.product_category;
                document.getElementById("name").value = product.product_name;
                document.getElementById("brand").value = product.brand;
                document.getElementById("pack-size").value = product.pack_size;
                document.getElementById("price").value = product.selling_price;
                document.getElementById("expiration").value = product.expiration_date;
                document.getElementById("description").value = product.description;
                document.getElementById("stock-level").value = product.current_stock_level;
                document.getElementById("reorder-level").value = product.reorder_level;
                document.getElementById("min-order").value = product.min_order_quantity;
                document.getElementById("lead-time").value = product.lead_time;
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }
});
