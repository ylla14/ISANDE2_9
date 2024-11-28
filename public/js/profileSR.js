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

        // Populate sales rep information
        document.getElementById("sales-rep-code").textContent = salesRepInfo.sales_rep_id || "ID not available";
        document.getElementById("sales-rep-name").textContent = salesRepInfo.name || "Name not available";
        document.getElementById("sales-rep-contact").textContent = salesRepInfo.contact_info || "Contact info not available";
        document.getElementById("sales-rep-email").textContent = salesRepInfo.email || "Email not available";
    } catch (error) {
        console.error('Error fetching sales representative info:', error);
        document.getElementById("sales-rep-code").textContent = "Sales representative information is not available.";
    }
}


// Logout functionality
document.getElementById("logoutButton").addEventListener("click", () => {
    window.location.href = "login.html";
});
