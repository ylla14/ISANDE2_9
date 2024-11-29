document.getElementById("dashboard-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardSR.html"; 
});

document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventorySR.html"; 
});

document.getElementById("order-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "orderSR.html";
});


document.getElementById("customers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "customersSR.html";
});

document.getElementById("profile-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "profileSR.html";
});

document.getElementById("view-inventory-report-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "reorderReportIM.html"; 
});

document.getElementById("view-sales-report-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "salesreportSR.html"; 
});


        async function fetchSalesRepInfo(userId) {
            try {
                const response = await fetch(`/api/sales-representative/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const salesRepInfo = await response.json();

                // Populate sales rep information
                document.getElementById("sales-rep-name").textContent = salesRepInfo.name || "Name not available";
            } catch (error) {
                console.error('Error fetching sales representative info:', error);
                document.getElementById("sales-rep-code").textContent = "Sales representative information is not available.";
            }
        }

    async function populateTotalStats(userId) {
        fetch(`/sales-rep-stats/${userId}`)
            .then(response => response.json())
            .then(data => {
            console.log('Fetched stats data:', data);
        
            // Ensure totalSales is a valid number before using .toFixed()
            const totalSales = Number(data.totalSales) || 0;  // Default to 0 if invalid
            document.getElementById('total-sales').textContent = `₱${totalSales.toFixed(2)}`;
            document.getElementById('total-customers').textContent = data.totalCustomers || 0;
            document.getElementById('total-orders').textContent = data.totalOrders || 0;
        })
            .catch(err => {
                console.error('Error fetching stats:', err);
            });
    }
        

        document.addEventListener('DOMContentLoaded', () => {
            const userId = sessionStorage.getItem("userId") || document.body.dataset.salesRepId;
            if (userId) {
                populateTotalStats(userId); 
                fetchSalesRepInfo(userId); // Optionally fetch sales rep info as well
            } else {
                console.error("User ID not found in session storage.");
                document.getElementById("sales-rep-code").textContent = "Sales representative information is not available.";
            }
        });
