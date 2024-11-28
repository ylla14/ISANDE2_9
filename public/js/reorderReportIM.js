function downloadPDF() {
    const element = document.getElementById('report-container'); // Target the report container
    const options = {
        margin: 0.5,
        filename: 'Reorder_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(options).from(element).save();
}
async function loadReorderReportData() {
    try {
        // Fetch data from the reorder report API
        const response = await fetch('/api/reorder-report');
        const reorderReport = await response.json();

        // Get the table body element
        const tbody = document.querySelector('.table-section tbody');
        tbody.innerHTML = ''; // Clear any existing rows

        // Populate the table
        reorderReport.forEach(item => {
            // Only process items with Low Stock status
            if (item.stock_status !== 'Low Stock') {
                return; // Skip items that are not "Low Stock"
            }

            const row = document.createElement('tr');

            let reorderQty = item.reorder_level - item.current_stock_level;

            // If reorderQty is less than min_order_quantity and not equal to 0, use the reorder level
            if (reorderQty < item.min_order_quantity) {
                reorderQty = item.min_order_quantity; // Set to reorder level if it's less than min order quantity
            }

            // Create the row HTML with the required columns
            row.innerHTML = `
                <td>${item.supplier_id}</td>
                <td>${item.supplier_name}</td>
                <td>${item.product_id}</td>
                <td>${item.product_name}</td>
                <td>${item.current_stock_level}</td>
                <td>${item.min_order_quantity }</td>
                <td>${item.reorder_level}</td>
                <td>${item.lead_time}</td>
                <td>${reorderQty}</td> <!-- Show reorder quantity if stock status is "Low Stock" -->
            `;

            // Append the row to the table body
            tbody.appendChild(row);
        });

        // Set the report generation date
        document.getElementById('reportDate').textContent = new Date().toLocaleDateString();

    } catch (error) {
        console.error('Error loading reorder report data:', error);
    }
}

// Call the function when the page loads
window.onload = loadReorderReportData;
