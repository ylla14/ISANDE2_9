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
document.getElementById("cancel-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the button

    const confirmCancel = confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
    
    if (confirmCancel) {
        window.location.href = "inventoryIM.html"; // Redirect to the inventory page if confirmed
    }
});

// Fetch and populate brand dropdown
async function loadBrands() {
    try {
        const response = await fetch("/api/brands"); // Make sure this endpoint exists
        const brands = await response.json();
        const brandSelect = document.querySelector("#brand");
        
        brands.forEach(brand => {
            const option = document.createElement("option");
            option.value = brand.supplier_id; // Assuming brand has a supplier_id
            option.textContent = brand.supplier_name; // Assuming brand has a supplier_name
            brandSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching brands:", error);
    }
}

// Call function to load brands on page load
document.addEventListener("DOMContentLoaded", loadBrands);


const form = document.querySelector(".container");
const saveButton = document.querySelector(".save-button");
const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

// Image upload handling
document.querySelector(".product-image img").addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.querySelector(".product-image img").src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

const brandSkuPrefixes = {
    "Aurolab": "AR",
    "Brady Super Block": "SB",
    "Oatsense": "OT",
    "Thioderm": "TH",
    "Red Pharma": "RP",
    "Verdura": "VD",
    "Citriol": "CT",
    "Brady Soap Bars": "BR"
};

async function generateSku(brand) {
    if (!brandSkuPrefixes[brand]) {
        console.error("No SKU prefix found for brand:", brand);
        return "";
    }

    const prefix = brandSkuPrefixes[brand];

    try {
        // Fetch existing SKUs from the database
        const response = await fetch("/api/products/skus");
        const existingSkus = await response.json();

        // Find the highest number used for this brand
        let highestNumber = 0;
        existingSkus.forEach(sku => {
            const match = sku.match(new RegExp(`^${prefix}(\\d{3})$`));
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > highestNumber) {
                    highestNumber = num;
                }
            }
        });

        // Generate the next available SKU number
        const nextNumber = String(highestNumber + 1).padStart(3, "0");
        return prefix + nextNumber;
    } catch (error) {
        console.error("Error fetching SKUs:", error);
        return "";
    }
}

function validateNumericFields() {
    let isValid = true;
    const numericFields = [
        { id: "price", name: "Selling Price" },
        { id: "cost-price", name: "Cost Price" },
        { id: "stock-level", name: "Current Stock Level" },
        { id: "reorder-level", name: "Reorder Level" },
        { id: "min-order", name: "Minimum Order Quantity" },
        { id: "lead-time", name: "Lead Time" }
    ];

    numericFields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorSpan = document.getElementById(`${field.id}-error`);

        if (!/^\d+(\.\d+)?$/.test(input.value.trim())) {
            input.style.border = "2px solid red";
            errorSpan.textContent = `${field.name} must be a valid number.`;
            isValid = false;
        } else {
            input.style.border = "";
            errorSpan.textContent = "";
        }
    });

    return isValid;
}



// Function to validate expiration date
function validateExpirationDate() {
    const expirationInput = document.querySelector("#expiration");
    const expirationDate = new Date(expirationInput.value);
    const today = new Date();
    
    // Set time to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);

    if (expirationDate < today) {
        expirationInput.style.border = "2px solid red";
        alert("Expiration date cannot be in the past.");
        return false;
    }

    expirationInput.style.border = "";
    return true;
}

// Attach event listener to validate expiration on input change
document.querySelector("#expiration").addEventListener("change", validateExpirationDate);

saveButton.addEventListener("click", async () => {
    // Validate expiration date and numeric fields before proceeding
    if (!validateExpirationDate() || !validateNumericFields()) {
        return;
    }

    const brandSelect = document.querySelector("#brand");
    const selectedBrand = brandSelect.options[brandSelect.selectedIndex].text;

    if (!selectedBrand) {
        alert("Please select a brand.");
        return;
    }

    const generatedSku = await generateSku(selectedBrand);
    if (!generatedSku) {
        alert("Failed to generate SKU.");
        return;
    }

    const formData = new FormData();
    formData.append("product_id", generatedSku);  // Use generated SKU as product_id
    formData.append("product_category", document.querySelector("#category").value);
    formData.append("product_name", document.querySelector("#name").value);
    formData.append("supplier_id", brandSelect.value);
    formData.append("pack_size", document.querySelector("#pack-size").value);
    formData.append("selling_price", document.querySelector("#price").value);
    formData.append("cost_price", document.querySelector("#cost-price").value);
    formData.append("expiration_date", document.querySelector("#expiration").value);
    formData.append("description", document.querySelector("#description").value);
    formData.append("current_stock_level", document.querySelector("#stock-level").value);
    formData.append("reorder_level", document.querySelector("#reorder-level").value);
    formData.append("min_order_quantity", document.querySelector("#min-order").value);
    formData.append("lead_time", document.querySelector("#lead-time").value);
    if (imageInput.files[0]) {
        formData.append("product_image", imageInput.files[0]);
    }

    try {
        const response = await fetch("/api/products/add", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            alert("Product added successfully!");
            window.location.href = "inventoryIM.html";
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error adding product:", error);
        alert("An error occurred. Please try again later.");
    }
});