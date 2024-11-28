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

document.getElementById("back-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "OrderSR.html"; // Redirect to the inventory page
});

function SendInvoice() {
    var params = {
        orderID: document.getElementById("order-title").textContent.replace("ORD", ""), // Extract order ID from the title
        CustomerName: document.getElementById("customer-name").textContent,
        orderDate: document.getElementById("purchased-date").textContent,
        overallTotal: calculateOverallTotal(), // Compute total dynamically
        salesRepName: document.getElementById("sales-rep-name").textContent,
        contactInfo: document.getElementById("sales-rep-contactinfo").textContent,
        order_details: generateOrderDetails() 
    };

    emailjs.send("service_voi1upb", "template_2llj3f1", params).then(function (res) {
        alert("Success!" + res.status);
    });
}

function calculateOverallTotal() {
    let totalPrice = 0;
    const rows = document.querySelectorAll("#order-items-table tr");
    rows.forEach(row => {
        const total = parseFloat(row.querySelector("td:nth-child(4)").textContent.replace("P", "").trim());
        if (!isNaN(total)) {
            totalPrice += total;
        }
    });
    return totalPrice.toFixed(2); // Return the total as a string with two decimals
}

function generateOrderDetails() {
    let rows = [];
    const tableRows = document.querySelectorAll("#order-items-table tr");
    let overallTotal = 0;

    // Add table header for the email
    rows.push(`
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 8px;">Product Name</th>
                    <th style="border: 1px solid #000; padding: 8px;">Unit Price</th>
                    <th style="border: 1px solid #000; padding: 8px;">Quantity</th>
                    <th style="border: 1px solid #000; padding: 8px;">Total Price</th>
                </tr>
            </thead>
            <tbody>
    `);

    // Generate table rows
    tableRows.forEach(row => {
        const productName = row.querySelector("td:first-child").textContent.trim();
        const unitPrice = parseFloat(row.querySelector("td:nth-child(3)").textContent.trim());
        const quantity = parseInt(row.querySelector("td:nth-child(2)").textContent.trim());
        const totalPrice = parseFloat(row.querySelector("td:nth-child(4)").textContent.trim());

        overallTotal += totalPrice; // Add to overall total

        rows.push(`
            <tr>
                <td style="border: 1px solid #000; padding: 8px;">${productName}</td>
                <td style="border: 1px solid #000; padding: 8px;">${unitPrice.toFixed(2)}</td>
                <td style="border: 1px solid #000; padding: 8px;">${quantity}</td>
                <td style="border: 1px solid #000; padding: 8px;">${totalPrice.toFixed(2)}</td>
            </tr>
        `);
    });

    // Add the footer with the overall total
    rows.push(`
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="text-align: right; font-weight: bold; border: 1px solid #000; padding: 8px;">Overall Total Price:</td>
                    <td style="font-weight: bold; border: 1px solid #000; padding: 8px;">${overallTotal.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    `);

    return rows.join(""); // Return the entire HTML table as a string
}



