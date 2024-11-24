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


// Select the Inventory link by its ID
document.getElementById("suppliers-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    window.location.href = "suppliersIM.html"; // Redirect to the inventory page
});

async function loadRecentRestocks() {
  try {
      const response = await fetch('/api/recent-restocks');
      const data = await response.json();

      const sidebarContent = document.querySelector('.sidebar-content');

      // Clear existing content except for the header
      sidebarContent.innerHTML = '<h2>Recent Inventory Restocks</h2>';

      // Populate the sidebar with data
      for (const [restockId, details] of Object.entries(data)) {
          const restockGroup = document.createElement('div');
          restockGroup.classList.add('restock-group');

          // Format the delivery date for this specific restock
          const formattedDate = new Date(details.delivery_date).toLocaleDateString();

          // Add restock header
          const restockHeader = document.createElement('a'); // Use <a> to make it clickable
          restockHeader.classList.add('restock-header');
          restockHeader.href = `restockTransIM.html?porder_id=${details.porder_id}`; // Pass the porder_id
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

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadRecentRestocks);
