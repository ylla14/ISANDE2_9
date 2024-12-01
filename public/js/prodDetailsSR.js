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
    window.location.href = "inventorySR.html"; // Redirect to the inventory page
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

                // Fetch and display the product image
                const productImage = document.getElementById("product-image");
                if (product.product_image) {
                    productImage.src = product.product_image; // Set the image source
                    productImage.alt = product.product_name; // Add alt text for accessibility
                } else {
                    productImage.src = "resources/brady_logo.jpg"; // Fallback image if no product image is provided
                    productImage.alt = "Placeholder Image";
                }
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }
});