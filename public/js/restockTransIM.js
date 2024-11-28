document.getElementById("home-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardIM.html"; // Redirect to the inventory page
});

// Select the Inventory link by its ID
document.getElementById("inventory-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "inventoryIM.html"; // Redirect to the inventory page
});

document.getElementById("sales-link").addEventListener("click", function(event) {
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

document.getElementById("back-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "dashboardIM.html"; // Redirect to the inventory page
});


// Extract the `porder_id` from the URL
function getPorderIdFromUrl() {
    return new URLSearchParams(window.location.search).get('porder_id');
}

// Fetch and display restock details
async function fetchRestockDetails(porderId) {
    try {
        const response = await fetch(`/api/purchase-orders/${porderId}/details`);
        if (!response.ok) throw new Error();

        const details = await response.json();
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = details.length
            ? details.map(detail => `
                <tr>
                    <td>${detail.product_id}</td>
                    <td>${detail.product_name}</td>
                    <td>${detail.brand || "N/A"}</td>
                    <td>${detail.category || "N/A"}</td>
                    <td>₱${formatNumber(detail.unit_price)}</td>
                    <td>${detail.quantity}</td>
                    <td>₱${formatNumber(detail.total_price)}</td>
                </tr>
              `).join('')
            : `<tr><td colspan="7">No data available</td></tr>`;
    } catch {
        displayError();
    }
}

// Display an error in the table
function displayError() {
    document.querySelector('tbody').innerHTML = `<tr><td colspan="7">Error loading data</td></tr>`;
}

// Format numbers with commas
function formatNumber(number) {
    return parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Update page title
function updateTitle(porderId) {
    document.querySelector('.header #title').textContent = `Restock ${porderId.slice(-3)}`;
}

// Check if the purchase order is already confirmed
async function isOrderConfirmed(porderId) {
    try {
        const response = await fetch(`/api/purchase-orders/${porderId}/status`);
        return response.ok ? (await response.json()).status === 'confirmed' : false;
    } catch {
        return false;
    }
}

// Confirm stock update and order
async function confirmOrder(porderId, products) {
    try {
        const stockResponse = await fetch('/api/update-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ porderId, products }),
        });

        if (!stockResponse.ok) throw new Error();

        const confirmResponse = await fetch('/api/confirm-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ porderId }),
        });

        if (confirmResponse.ok) {
            alert('Stock updated and purchase order confirmed!');
            updateConfirmButton(true);
        } else {
            throw new Error();
        }
    } catch {
        alert('An error occurred while updating stock or confirming the order.');
    }
}

// Update the Confirm button based on status
function updateConfirmButton(isConfirmed) {
    const button = document.getElementById('confirm-button');
    button.disabled = isConfirmed;
    button.textContent = isConfirmed ? 'Confirmed' : 'Confirm';
    button.style.backgroundColor = isConfirmed ? '#4CAF50' : '#000058';
    button.style.color = isConfirmed ? 'white' : 'white';
    button.classList.toggle('confirmed-button', isConfirmed);
}

// Handle Confirm button click
async function handleConfirmClick() {
    const porderId = getPorderIdFromUrl();
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    const products = rows.map(row => ({
        productId: row.children[0].textContent,
        quantity: parseInt(row.children[5].textContent, 10),
    })).filter(product => product.quantity > 0);

    await confirmOrder(porderId, products);
}

// Initialize the page
async function initializePage() {
    const porderId = getPorderIdFromUrl();
    if (!porderId) return displayError();

    updateTitle(porderId);
    await fetchRestockDetails(porderId);

    const isConfirmed = await isOrderConfirmed(porderId);
    updateConfirmButton(isConfirmed);

    if (!isConfirmed) {
        document.getElementById('confirm-button').addEventListener('click', handleConfirmClick);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);
