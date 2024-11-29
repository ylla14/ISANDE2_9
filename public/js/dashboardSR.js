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
    window.location.href = "inventoryReportSR.html"; 
});

document.getElementById("view-sales-report-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "salesReportSR.html"; 
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


        const userId = sessionStorage.getItem("userId") || document.body.dataset.salesRepId;

// Fetch sales data by month
fetch(`/sales-by-month?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        const months = data.map(row => `${row.month}-${row.year}`);
        const salesByMonth = data.map(row => row.total_sales);

        const ctx = document.getElementById('salesByMonthChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Sales',
                    data: salesByMonth,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(err => console.error('Error fetching sales by month:', err));

// Fetch sales data by brand (supplier)
fetch(`/sales-by-brand?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        const brands = data.map(row => row.brand); // brand = supplier_name
        const salesByBrand = data.map(row => row.total_sales);

        const ctx = document.getElementById('salesByBrandChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: brands,
                datasets: [{
                    label: 'Total Sales by Brand',
                    data: salesByBrand,
                    backgroundColor: '#36a2eb',  // Solid color for bars
                    borderColor: '#36a2eb',      // Solid color for borders
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(err => console.error('Error fetching sales by brand:', err));

// Fetch total number of products sold per brand
fetch(`/products-sold-per-category?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        const brands = data.map(row => row.brand); // brand = supplier_name
        const productsSold = data.map(row => row.total_products_sold);

        const ctx = document.getElementById('productsSoldPerCategoryChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: brands,
                datasets: [{
                    label: 'Total Products Sold per Brand',
                    data: productsSold,
                    backgroundColor: '#ff9f40',  // Solid color for bars
                    borderColor: '#ff9f40',      // Solid color for borders
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(err => console.error('Error fetching products sold per category:', err));
