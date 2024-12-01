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

document.getElementById('filter-btn').addEventListener('click', loadMonthlySalesReportData);

// Helper function to format date as MM/DD/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0'); // Get the day
    const year = date.getFullYear(); // Get the year
    return `${month}/${day}/${year}`; // Return formatted date
}


async function loadMonthlySalesReportData() {
    const month = document.getElementById('month-filter').value;
    const year = document.getElementById('year-filter').value;

    let url = '/api/monthly-sales-report';
    if (month || year) {
        const queryParams = new URLSearchParams();
        if (month) queryParams.append('month', month); // Send numeric month
        if (year) queryParams.append('year', year);
        url += `?${queryParams.toString()}`;
    }

    try {
        const response = await fetch(url);
        const monthlySalesReport = await response.json();

        // Sort data by 'Purchase Date'
        monthlySalesReport.sort((a, b) => {
            const dateA = new Date(a["Purchase Date"]);
            const dateB = new Date(b["Purchase Date"]);
            return dateA - dateB; // Sort ascending
        });

        // Get the table body
        const tbody = document.querySelector('.table-section tbody');
        tbody.innerHTML = ''; // Clear existing rows

        // Format and populate rows
        monthlySalesReport.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data["Month"]}</td>
                <td>${data["Customer ID #"]}</td>
                <td>${data["Customer Name"]}</td>
                <td>${data["Order ID #"]}</td>
                <td>${data["Product ID #"]}</td>
                <td>${data["Product Name"]}</td>
                <td>${data["QTY"]}</td>
                <td>${parseFloat(data["Total Cost"] || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching sales report:', error);
    }
}




function populateYearDropdown() {
    const yearDropdown = document.getElementById('year-filter');
    const currentYear = new Date().getFullYear();
    for (let year = 2021; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    }
}

populateYearDropdown();

// Call the function when the page loads
window.onload = loadMonthlySalesReportData;
