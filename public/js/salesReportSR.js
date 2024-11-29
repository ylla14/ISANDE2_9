document.getElementById("dashboard-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardSR.html"; // Redirect to the inventory page
});

function downloadPDF() {
    const element = document.getElementById('report-container'); // Target the report container
    const options = {
        margin: 0.5,
        filename: 'Monthly Sales Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'legal', orientation: 'landscape' }
    };
    html2pdf().set(options).from(element).save();
}

async function loadMonthlySalesReportData() {
    try {
        // Fetch data from the reorder report API
        const response = await fetch('/api/monthly-sales-report');
        const monthlySalesReport = await response.json();

        // Sort data by 'Month' field (assuming it's in a sortable format like 'YYYY-MM')
        monthlySalesReport.sort((a, b) => {
            const dateA = new Date(a["Purchase Date"]);
            const dateB = new Date(b["Purchase Date"]);
            return dateA - dateB; // Sorting by ascending date
        });

        // Get the table body element
        const tbody = document.querySelector('.table-section tbody');
        tbody.innerHTML = ''; // Clear any existing rows

        // Helper function to format date as MM/DD/YYYY
        function formatDate(dateString) {
            const date = new Date(dateString);
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1)
            const day = String(date.getDate()).padStart(2, '0'); // Get day
            const year = date.getFullYear(); // Get year
            return `${month}/${day}/${year}`; // Return formatted date
        }

        // Populate the table
        monthlySalesReport.forEach(data => {
            // Ensure Total Cost is a valid number and is not undefined or null
            let totalCost = parseFloat(data["Total Cost"]);
            if (isNaN(totalCost)) {
                totalCost = 0; // Default to 0 if the value is not a valid number
            }
            
            const formattedTotalCost = totalCost.toFixed(2); // Safe to use toFixed

            // Format Purchase Date
            const formattedPurchaseDate = formatDate(data["Purchase Date"]);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data["Month"]}</td>
                <td>${formattedPurchaseDate}</td>
                <td>${data["Customer ID #"]}</td>
                <td>${data["Customer Name"]}</td>
                <td>${data["Order ID #"]}</td>
                <td>${data["Product ID #"]}</td>
                <td>${data["Product Name"]}</td>
                <td>${data["QTY"]}</td>
                <td>${formattedTotalCost}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching sales report:', error);
    }
}



// Call the function when the page loads
window.onload = loadMonthlySalesReportData;
