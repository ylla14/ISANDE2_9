// Select the Inventory link by its ID
document.getElementById("home-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardIM.html"; // Redirect to the inventory page
});

document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventoryIM.html"; // Redirect to the inventory page
});

document.getElementById("sales-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "salesOrderIM.html"; // Redirect to the inventory page
});

document.getElementById("view-btn").addEventListener("click", function(event) {
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

//Reports Section
document.getElementById("reorder-report-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "reorderReportIM.html"; // Redirect to the inventory page
});

document.getElementById("expiry-report-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "expiryReportIM.html"; // Redirect to the inventory page
});

// Side bar function to load recent restocks
async function loadRecentRestocks() {
    try {
        const response = await fetch('/api/recent-restocks'); // fetch from recent restocks (po table)
        const data = await response.json();
  
        const sidebarContent = document.querySelector('.sidebar-content');
  
        // Clear existing content except for the header
        sidebarContent.innerHTML = '<h2>Recent Inventory Restocks</h2>';
  
        // Populate the sidebar with data
        for (const [restockId, details] of Object.entries(data)) {
            const restockGroup = document.createElement('div');
            restockGroup.classList.add('restock-group');
  
            // Apply the left border color based on status
            const statusColor = details.status === 'confirmed' ? 'green' : 'red';
            restockGroup.style.borderLeft = `4px solid ${statusColor}`; // 4px solid color
  
            // Format the delivery date for this specific restock
            const formattedDate = new Date(details.delivery_date).toLocaleDateString();
  
            // Add restock header
            const restockHeader = document.createElement('a'); // Use <a> to make it clickable
            restockHeader.classList.add('restock-header');
            restockHeader.href = `restockTransIM.html?porder_id=${details.porder_id}`; // Pass the porder_id >> go to restrans of that porder
            restockHeader.textContent = `${restockId} - ${formattedDate}`;
            restockGroup.appendChild(restockHeader);
  
            // Add list of products
            const productList = document.createElement('ul');
            productList.classList.add('restock-products');
  
            details.products.forEach(product => {
                const productItem = document.createElement('li');
                productItem.textContent = product;
                productList.appendChild(productItem);
            });
  
            restockGroup.appendChild(productList);
  
            // Add a horizontal divider
            const hr = document.createElement('hr');
            restockGroup.appendChild(hr);
  
            sidebarContent.appendChild(restockGroup);
        }
    } catch (error) {
        console.error('Error fetching recent restocks:', error);
    }
  }
  


// script.js
async function loadSalesOrderData() {
    try {
        const response = await fetch('/api/salesorders');
        const salesorders = await response.json(); // Use a plural variable name for clarity
        console.log('Fetched orders:', salesorders); // Check what data is received

        const tbody = document.querySelector('.table-section table tbody'); // Targeting tbody within the table
        tbody.innerHTML = ''; // Clear any existing rows

        // Filter sales orders to only include those with "paid" status
        const paidOrders = salesorders.filter(order => order.status === 'paid');

        paidOrders.forEach(salesorder => { // Iterating over each sales order
            const row = document.createElement('tr');

            // Convert dates for the current sales order
            const orderDate = new Date(salesorder.purchased_date); // Use the correct date field
            const deliveryDate = new Date(salesorder.delivery_date);

            const orderDateDisplay = orderDate.toLocaleDateString();
            const deliveryDateDisplay = deliveryDate.toLocaleDateString();

            row.addEventListener('click', () => {
                console.log(salesorder); // This will show the structure of `salesorder`
                window.location.href = `OrderDetailIM.html?orderId=${salesorder.order_id}`; // Adjust to correct key name
            });

            row.innerHTML = `
                <td>${salesorder.order_code}</td>
                <td>${deliveryDateDisplay}</td>
                <td>${salesorder.total_order_value}</td>
            `;

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading sales order data:', error);
    }
}

// // Fetch sales data by brand
// fetch('/api/sales-by-brand')
//     .then(response => response.json())
//     .then(data => {
//         // Prepare the data for the chart
//         const brands = data.map(row => row.brand);
//         const totalSales = data.map(row => row.total_sales);

//         // Create and render the chart
//         const ctx = document.getElementById('salesByBrandChart').getContext('2d');
//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: brands,
//                 datasets: [{
//                     label: 'Total Sales per Brand',
//                     data: totalSales,
//                     backgroundColor: '#008000',
//                     borderColor: '#008000',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     })
//     .catch(err => console.error('Error fetching sales data by brand:', err));



// Call the function when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadRecentRestocks();
    loadSalesOrderData(); // This function does not need to be awaited unless it has async operations
});


