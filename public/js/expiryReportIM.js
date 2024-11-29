function downloadPDF() {
    const element = document.getElementById('report-container');
    const options = {
        margin: 0.5,
        filename: 'Expiry_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(options).from(element).save();
}

async function loadExpiryReportData() {
    try {
        const response = await fetch('/api/expiry-report');
        const expiryReport = await response.json();

        // Get the table body element
        const tbody = document.querySelector('.table-section tbody');
        tbody.innerHTML = ''; // Clear any existing rows

        const today = new Date(); // Get today's date

        // Populate the table
        expiryReport.forEach(item => {
            // Parse expiration date from the database
            const expirationDate = new Date(item.expiration_date);

            // Calculate days until expiry
            const timeDiff = expirationDate - today;
            const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

            // Skip items where daysUntilExpiry < 0 (already expired)
            if (daysUntilExpiry < 0) {
                return;
            }

            // Create the row HTML with the required columns
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.supplier_name}</td>
                <td>${item.product_id}</td>
                <td>${item.product_name}</td>
                <td>${item.current_stock_level}</td>
                <td>${item.expiration_date}</td>
                <td>${daysUntilExpiry}</td>
                <td>${item.expiry_status}</td>
            `;

            // Append the row to the table body
            tbody.appendChild(row);
        });

        // Set the report generation date
        document.getElementById('reportDate').textContent = new Date().toLocaleDateString();

    } catch (error) {
        console.error('Error loading expiry report data:', error);
    }
}


// Call the function when the page loads
window.onload = loadExpiryReportData;
