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
        document.getElementById("sales-rep-code").textContent = manager.inventory_manager_id || "ID not available";
        document.getElementById("sales-rep-name").textContent = manager.name || "Name not available";
        document.getElementById("sales-rep-contact").textContent = manager.contact_info || "Contact info not available";
        document.getElementById("sales-rep-email").textContent = manager.email || "Email not available";
    } catch (error) {
        console.error('Error fetching sales representative info:', error);
        document.getElementById("sales-rep-code").textContent = "Sales representative information is not available.";
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


// Logout functionality
document.getElementById("logoutButton").addEventListener("click", () => {
    window.location.href = "login.html";
});
