function downloadPDF() {
    const element = document.getElementById('report-container');
    const options = {
        margin: 0.5,
        filename: 'Inventory_Level_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(options).from(element).save();
}

async function loadInventoryReportData() {
    try {
        const response = await fetch('/api/inventory-report');
        const inventoryData = await response.json();

        // Get the table body element
        const tbody = document.querySelector('.table-section tbody');
        tbody.innerHTML = ''; // Clear any existing rows

        // Populate the table
        inventoryData.forEach(item => {
            const row = document.createElement('tr');

            // Create the row HTML with the required columns
            row.innerHTML = `
                <td>${item.product_id}</td>
                <td>${item.supplier_name}</td>
                <td>${item.product_name}</td>
                <td>${item.pack_size}</td>
                <td>${item.current_stock_level}</td>
                <td>${item.min_stock_level}</td>
                <td>${item.max_stock_level}</td>
                <td>${item.sp}</td>
            `;

            // Append the row to the table body
            tbody.appendChild(row);
        });

        // Set the report generation date
        document.getElementById('reportDate').textContent = new Date().toLocaleDateString();

    } catch (error) {
        console.error('Error loading inventory report data:', error);
    }
}

// Call the function when the page loads
window.onload = loadInventoryReportData;