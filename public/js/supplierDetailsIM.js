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

document.getElementById("back-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "suppliersIM.html"; // Redirect to the inventory page
});

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const supplierId = urlParams.get("supplierId");
    console.log("Supplier ID:", supplierId);

    if (supplierId) {
        try {
            const response = await fetch(`/api/suppliers/${supplierId}`);
            const supplier = await response.json();

            if (supplier) {
                document.getElementById("sup-name").textContent = supplier.supplier_name;
                document.getElementById("contact-person").textContent = supplier.contact_person;
                document.getElementById("contact-email").textContent = supplier.email_address;
                document.getElementById("sup-id").textContent = supplier.supplier_id;
                document.getElementById("contact-details").textContent = supplier.contact_details;
                document.getElementById("physical-add").textContent = supplier.physical_address;
                document.getElementById("mailing-add").textContent = supplier.mailing_address;
                document.getElementById("brn").textContent = supplier.business_registration_number;
                document.getElementById("pay-terms").textContent = supplier.payment_terms;
                document.getElementById("banking-details").textContent = supplier.banking_details;
                document.getElementById("contract-expiry").textContent = supplier.contract_expiry_date;
            }
        } catch (error) {
            console.error("Error fetching supplier details:", error);
        }
    }
});
