const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const PORT =  3000;

app.use(express.json()); // For parsing JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // For CSS, JS, and resource
app.use(express.static(path.join(__dirname, 'views')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'ims'
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); 
});

//idk if this works na without having to use these middlewares
// app.get('/dashboardIM.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'dashboardIM.html'));
// });


// app.get('/dashboardSR.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'dashboardSR.html'));
// });


 
app.post('/login', (req, res) => {
    const { userId, password } = req.body; // Get userId and password from request body

    // Check if may given na uid and pass
    if (!userId || !password) {
        return res.status(400).json({ message: 'User ID and password are required.' });
    }

    let userRole = ''; //idk what im gonna do pa w dis pero keep muna

    // check muna im table
    const inventoryManagerQuery = 'SELECT * FROM InventoryManager WHERE inventory_manager_id = ?';

    db.execute(inventoryManagerQuery, [userId], (error, inventoryManagerResults) => {
        if (error) {
            console.error('Error executing InventoryManager query:', error);
            return res.status(500).json({ message: 'Server error occurred.' });
        }

        if (inventoryManagerResults.length > 0) {
            const user = inventoryManagerResults[0]; 
            if (user.password === password) {
                userRole = 'InventoryManager'; // Set role
                return res.json({
                    message: 'Login successful',
                    homepage: '/dashboardIM.html' // Redirect to Inventory Manager dashboard
                });
            } else {
                return res.status(401).json({ message: 'Wrong User ID or password.' });
            }
        } else {
            // If not found in InventoryManager, check SalesRepresentative table
            const salesRepQuery = 'SELECT * FROM SalesRepresentatives WHERE sales_rep_id = ?';

            db.execute(salesRepQuery, [userId], (error, salesRepResults) => {
                if (error) {
                    console.error('Error executing SalesRepresentative query:', error);
                    return res.status(500).json({ message: 'Server error occurred.' });
                }

                if (salesRepResults.length > 0) {
                    const user = salesRepResults[0]; // Get the user data from SalesRepresentative
                    if (user.password === password) { // In practice, use bcrypt.compare() for hashed passwords
                        userRole = 'SalesRepresentative'; // Set role
                        return res.json({
                            message: 'Login successful',
                            homepage: '/dashboardSR.html', // Redirect to Sales Representative dashboard
                            salesRep: {
                                id: user.sales_rep_id,
                                name: user.name // Assume 'name' field stores Sales Rep's name
                            }
                        });
                    } else {
                        return res.status(401).json({ message: 'Wrong User ID or password.' });
                    }
                } else {
                    // User ID not found in either table
                    return res.status(401).json({ message: 'Wrong User ID or password.' });
                }
            });
        }
    });
});

app.post('/api/purchase-order', (req, res) => {
    const { supplier_id, order_date, delivery_date, order_address, products } = req.body;

    if (!supplier_id || !order_date || !products || products.length === 0) {
        return res.status(400).json({ error: 'Missing required fields or no products provided' });
    }

    // Helper to get the next ID
    const getNextId = (table, column, prefix, callback) => {
        const query = `SELECT ${column} FROM ${table} ORDER BY ${column} DESC LIMIT 1`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching the highest ID from ${table}:`, err);
                return callback(err, null);
            }

            const lastId = results[0]?.[column] || `${prefix}000`; // Default if no records exist
            const match = lastId.match(new RegExp(`${prefix}(\\d+)$`)); // Extract numeric part
            const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
            const nextId = `${prefix}${String(nextNumber).padStart(3, '0')}`;
            callback(null, nextId);
        });
    };

    // Step 1: Generate Purchase Order ID
    getNextId('PurchaseOrders', 'porder_id', 'PO', (err, porder_id) => {
        if (err) return res.status(500).json({ error: 'Failed to generate Purchase Order ID' });

        // Insert into PurchaseOrders
        const purchaseOrderQuery = `
            INSERT INTO PurchaseOrders (porder_id, supplier_id, order_date, delivery_date, order_address)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(
            purchaseOrderQuery,
            [porder_id, supplier_id, order_date, delivery_date, order_address],
            (err) => {
                if (err) {
                    console.error('Error inserting into PurchaseOrders:', err);
                    return res.status(500).json({ error: 'Failed to insert purchase order' });
                }

                // Step 2: Generate Order Detail IDs and Insert Details
                const purchaseOrderDetailsQuery = `
                    INSERT INTO PurchaseOrderDetails 
                    (order_detail_id, porder_id, product_id, unit_price, quantity, total_price)
                    VALUES ?
                `;

                // Helper to generate order detail IDs
                const generateOrderDetailIds = (products, callback) => {
                    getNextId('PurchaseOrderDetails', 'order_detail_id', 'POD', (err, baseOrderDetailId) => {
                        if (err) return callback(err, null);

                        const match = baseOrderDetailId.match(/POD(\d+)$/);
                        let nextNumber = match ? parseInt(match[1], 10) : 1;

                        const orderDetails = products.map((product) => {
                            const orderDetailId = `POD${String(nextNumber++).padStart(3, '0')}`;
                            return [
                                orderDetailId, // Unique Order Detail ID
                                porder_id,
                                product.productId,
                                product.unitPrice,
                                product.quantity,
                                product.totalPrice,
                            ];
                        });

                        callback(null, orderDetails);
                    });
                };

                generateOrderDetailIds(products, (err, orderDetailsValues) => {
                    if (err) return res.status(500).json({ error: 'Failed to generate Order Detail IDs' });

                    db.query(purchaseOrderDetailsQuery, [orderDetailsValues], (err) => {
                        if (err) {
                            console.error('Error inserting into PurchaseOrderDetails:', err);
                            return res.status(500).json({ error: 'Failed to insert purchase order details' });
                        }

                        res.status(201).json({ message: 'Purchase order created successfully', porder_id });
                    });
                });
            }
        );
    });
});

// Define route to get product data with supplier name
app.get('/api/products', (req, res) => {
    const query = `
      SELECT 
        p.product_id, 
        p.product_name, 
        s.supplier_name AS brand, 
        p.product_category, 
        p.selling_price, 
        p.current_stock_level, 
        p.reorder_level, 
        p.expiration_date, 
        p.pack_size, 
        p.cost_price, 
        p.min_order_quantity, 
        p.lead_time, 
        p.product_image, 
        p.description,
        p.stock_status,
        p.expiry_status
      FROM 
        Products p
      JOIN 
        Suppliers s ON p.supplier_id = s.supplier_id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data from database');
        return;
      }
      res.json(results);
    });
  });

  app.get('/api/suppliers', (req, res) => {
    const query = `
      SELECT 
        s.supplier_id,
        s.supplier_name, 
        s.contact_person,
        s.email_address,
        s.contact_details,
        s.physical_address,
        s.mailing_address,
        s.business_registration_number,
        s.contract_expiry_date,
        s.payment_terms,
        s.banking_details
      FROM 
        Suppliers s
    `;

    // Execute the query using your database connection
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to retrieve suppliers' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/api/inventory-manager/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
      SELECT 
        inventory_manager_id, 
        name, 
        contact_info, 
        email, 
        address,
        CURRENT_DATE() AS order_date
      FROM 
        InventoryManager
      WHERE
        inventory_manager_id = ?
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving data from database');
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Inventory manager not found' });
            return;
        }
        res.json(results[0]); // Send only the first result
    });
});


// Endpoint to get all purchase orders with supplier names
app.get('/api/purchase-orders', (req, res) => {
    const query = `
      SELECT 
        po.porder_id, 
        s.supplier_name, 
        po.order_date, 
        po.delivery_date, 
        po.order_address
        po.status
      FROM 
        PurchaseOrders po
      JOIN 
        Suppliers s ON po.supplier_id = s.supplier_id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data from the database');
        return;
      }
      res.json(results);
    });
  });
  
  // Endpoint to get order details for a specific purchase order
  app.get('/api/purchase-orders/:porder_id/details', (req, res) => {
    const porder_id = req.params.porder_id;
    const query = `
    SELECT 
        pod.order_detail_id,
        pod.product_id,
        p.product_name,
        p.product_category AS category,
        pod.unit_price,
        pod.quantity,
        pod.total_price,
        s.supplier_name AS brand
    FROM 
        PurchaseOrderDetails pod
    JOIN 
        Products p ON pod.product_id = p.product_id
    JOIN
        Suppliers s ON p.supplier_id = s.supplier_id
    WHERE 
        pod.porder_id = ?
    `;
  
    db.query(query, [porder_id], (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data from the database');
        return;
      }
      res.json(results);
    });
  });
  
// Endpoint to get recent restocks with products and delivery date
app.get('/api/recent-restocks', (req, res) => {
    const query = `
      SELECT 
        po.porder_id,
        po.delivery_date,
        pod.product_id,
        p.product_name
      FROM 
        PurchaseOrders po
      JOIN 
        PurchaseOrderDetails pod ON po.porder_id = pod.porder_id
      JOIN 
        Products p ON pod.product_id = p.product_id
      ORDER BY po.porder_id DESC, po.delivery_date DESC
      LIMIT 10
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving restocks from the database');
        return;
      }
      
      // Group the results by restock ID
      const groupedData = results.reduce((acc, row) => {
        const restockId = `Restock ${row.porder_id.slice(-3)}`;
        if (!acc[restockId]) {
          acc[restockId] = {
            porder_id: row.porder_id,
            delivery_date: row.delivery_date,
            products: []
          };
        }
        acc[restockId].products.push(`${row.product_id}: ${row.product_name}`);
        return acc;
      }, {});
  
      // Send the grouped data as JSON response
      res.json(groupedData);
    });
  });

// Endpoint to update purchase order status to 'confirmed'
app.post('/api/confirm-order', (req, res) => {
    const { porderId } = req.body;

    // Update purchase order status to 'confirmed'
    const query = `UPDATE PurchaseOrders SET status = 'confirmed' WHERE porder_id = ?`;

    db.query(query, [porderId], (err, result) => {
        if (err) {
            res.status(500).send('Error updating purchase order status');
        } else {
            res.status(200).send('Purchase order confirmed');
        }
    });
});

// Endpoint to get the status of a purchase order
app.get('/api/purchase-orders/:porder_id/status', (req, res) => {
    const porder_id = req.params.porder_id;
    const query = `
        SELECT status
        FROM PurchaseOrders
        WHERE porder_id = ?
    `;
    
    db.query(query, [porder_id], (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving order status');
            return;
        }
        if (results.length > 0) {
            res.json({ status: results[0].status });
        } else {
            res.status(404).send('Purchase order not found');
        }
    });
});


  
// Endpoint to update stock in the Products table and update stock status
app.post('/api/update-stock', (req, res) => {
    const { porderId, products } = req.body;

    // Loop through each product in the request and update stock levels
    const updateQueries = products.map(product => {
        const { productId, quantity } = product;

        // Update query to add quantity to the current stock level
        return `
            UPDATE Products
            SET current_stock_level = current_stock_level + ?
            WHERE product_id = ?
        `;
    });

    // Perform the queries in sequence
    db.beginTransaction(err => {
        if (err) {
            res.status(500).send('Error starting transaction');
            return;
        }

        const promises = updateQueries.map((query, index) => {
            return new Promise((resolve, reject) => {
                db.query(query, [products[index].quantity, products[index].productId], (err, result) => {
                    if (err) {
                        db.rollback(() => {
                            reject(err);
                        });
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        // After updating stock, update stock status for each product
        const statusUpdateQueries = products.map(product => {
            const { productId } = product;
            return `
                UPDATE Products
                SET stock_status = 
                    CASE 
                        WHEN current_stock_level <= reorder_level THEN 'Low Stock'
                        ELSE 'Ok'
                    END
                WHERE product_id = ?
            `;
        });

        // Execute all update queries and commit the transaction
        Promise.all(promises)
            .then(() => {
                // Execute the status update queries
                const statusPromises = statusUpdateQueries.map((query, index) => {
                    return new Promise((resolve, reject) => {
                        db.query(query, [products[index].productId], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });
                });

                // Wait for both stock and status updates to finish
                Promise.all(statusPromises)
                    .then(() => {
                        db.commit(err => {
                            if (err) {
                                db.rollback(() => {
                                    res.status(500).send('Error committing transaction');
                                });
                            } else {
                                res.status(200).send('Stock and status updated successfully');
                            }
                        });
                    })
                    .catch(error => {
                        db.rollback(() => {
                            res.status(500).send('Error updating stock status: ' + error.message);
                        });
                    });
            })
            .catch(error => {
                db.rollback(() => {
                    res.status(500).send('Error updating stock: ' + error.message);
                });
            });
    });
});


app.get('/api/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const query = `
      SELECT 
        p.product_id, 
        p.product_name, 
        s.supplier_name AS brand, 
        p.product_category, 
        p.selling_price, 
        p.current_stock_level, 
        p.reorder_level, 
        p.expiration_date, 
        p.pack_size, 
        p.cost_price, 
        p.min_order_quantity, 
        p.lead_time, 
        p.product_image, 
        p.description,
        p.stock_status,
        p.expiry_status
      FROM 
        Products p
      JOIN 
        Suppliers s ON p.supplier_id = s.supplier_id
      WHERE 
        p.product_id = ?
    `;
  
    db.query(query, [productId], (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving product data');
        return;
      }
      if (results.length > 0) {
        res.json(results[0]); // Send back the first (and ideally only) result
      } else {
        res.status(404).send('Product not found');
      }
    });
});



// used to display the info of the supplier w/ just one layout for all
app.get('/api/suppliers/:supplierId', (req, res) => {
    const supplierId = req.params.supplierId;
    const query = `SELECT * FROM Suppliers WHERE supplier_id = ?`;
    
    db.query(query, [supplierId], (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving supplier data');
            return;
        }
        res.json(results[0]); // Send back the first result
    });
});

app.get('/api/suppliers/:supplier_id/products', (req, res) => {
    const supplierId = req.params.supplier_id;
    console.log('Fetching products for supplier ID:', supplierId); 

    const query = `
        SELECT product_id, product_category, product_name, selling_price 
        FROM Products 
        WHERE supplier_id = ?
    `;

    db.query(query, [supplierId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error retrieving products from database' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No products found for this supplier' });
        }

        res.json(results);
    });
});


//longer ver.
/*app.get('/api/suppliers/:supplier_id/products', (req, res) => { 
    const { supplier_id } = req.params;

    const query = `
      SELECT 
        p.product_id, 
        p.product_name, 
        s.supplier_name AS brand, 
        p.product_category, 
        p.selling_price, 
        p.current_stock_level, 
        p.reorder_level, 
        p.expiration_date, 
        p.pack_size, 
        p.cost_price, 
        p.min_order_quantity, 
        p.lead_time, 
        p.product_image, 
        p.description,
        p.stock_status,
        p.expiry_status
      FROM 
        Products p
      JOIN 
        Suppliers s ON p.supplier_id = s.supplier_id
      WHERE 
        p.supplier_id = ?
    `;

    db.query(query, [supplier_id], (err, results) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            res.status(500).send('Error retrieving data from database');
            return;
        }
        res.json(results);
    });
});*/




app.get('/api/sales-representative/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT sales_rep_id, name, CURRENT_DATE() AS order_date FROM SalesRepresentatives WHERE sales_rep_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving sales representative data:', err);
            return res.status(500).send('Error retrieving sales representative data');
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ sales_rep_id: null, sales_rep_name: null, order_date: null });
        }
    });
});

app.get('/api/OrdersSR', (req, res) => {
    const query = `
    SELECT
        CONCAT('ORD', LPAD(osr.order_id, 3, '0')) AS order_code,
        osr.order_id,
        osr.purchased_date,
        osr.customer_id,
        CONCAT(c.fname, ' ', c.lname) AS customer_name ,
        osr.status
    FROM 
        OrdersSR osr
    LEFT JOIN 
        Customers c ON osr.customer_id = c.customer_id
    GROUP BY 
        osr.order_id,
        osr.purchased_date,
        osr.customer_id,
        c.fname,
        c.lname,
        osr.status;
    `;
  
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving data from OrdersSR:', err); 
            res.status(500).send('Error retrieving data from database');
            return;
        }
        res.json(results);
    });    
});

app.get('/api/salesorders', (req, res) => {
    const query = `
    SELECT
        CONCAT('ORD', LPAD(osr.order_id, 3, '0')) AS order_code,
        osr.order_id,
        osr.purchased_date,
        osr.customer_id,
        CONCAT(c.fname, ' ', c.lname) AS customer_name,
        osr.sales_rep_id,
        osr.payment_ref_num AS payment_reference_number,
        osr.delivery_date,
        CONCAT(osr.order_address, ', ', osr.city, ', ', osr.barangay) AS full_address,
        osr.order_receiver,
        osr.status,
        osr.inventory_status, -- New column for inventory status
        COUNT(od.order_detail_id) AS total_products,
        SUM(od.total_price) AS total_order_value
    FROM 
        OrdersSR osr
    LEFT JOIN 
        Customers c ON osr.customer_id = c.customer_id
    LEFT JOIN 
        OrderDetails od ON osr.order_id = od.order_id
    GROUP BY 
        osr.order_id,
        osr.purchased_date,
        osr.customer_id,
        c.fname,
        c.lname,
        osr.sales_rep_id,
        osr.payment_ref_num,
        osr.delivery_date,
        osr.order_address,
        osr.city,
        osr.barangay,
        osr.order_receiver,
        osr.status,
        osr.inventory_status;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving data from OrdersSR:', err);
            res.status(500).send('Error retrieving data from database');
            return;
        }
        res.json(results);
    });
});


app.get('/api/customers/:lastName', (req, res) => {
    const lastName = req.params.lastName;
    const query = `SELECT * FROM Customers WHERE lname = ?`;

    db.query(query, [lastName], (err, results) => {
        if (err) {
            console.error('Error retrieving customer data:', err);
            return res.status(500).send('Error retrieving customer data');
        }
        if (results.length > 0) {
            res.json(results[0]); // Return the first matching customer
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    });
});

// Route to generate a new customer ID
app.get('/api/generate-new-customer-id', (req, res) => {
    const query = `SELECT MAX(customer_id) AS max_id FROM Customers`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error generating new customer ID:', err);
            return res.status(500).send('Error generating new customer ID');
        }

        const maxId = results[0].max_id;
        const newCustomerId = maxId ? maxId + 1 : 1; // Increment the max ID or start from 1 if no customers exist

        res.json({ newCustomerId });
    });
});

// Route to handle storing new customer information
app.post('/api/create-customer', (req, res) => {
    const { customer_code, first_name, last_name, contact_number, email_address } = req.body;
    const query = `
        INSERT INTO Customers (customer_id, fname, lname, contact_num, email)
        VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [customer_code, first_name, last_name, contact_number, email_address], (err, results) => {
        if (err) {
            console.error('Error saving customer data:', err);
            return res.status(500).send('Error saving customer data');
        }
        res.json({ success: true });
    });
});



app.get('/api/brands', (req, res) => {
    const query = `SELECT supplier_id, supplier_name FROM Suppliers`;
  
    db.query(query, (err, results) => {
      if (err) {
          res.status(500).send('Error retrieving brands from database');
          return;
      }
      res.json(results);
    });
});

app.get('/api/productName', (req, res) => {
    const query = `SELECT product_id, product_name FROM Products`;
  
    db.query(query, (err, results) => {
      if (err) {
          res.status(500).send('Error retrieving products from database');
          return;
      }
      res.json(results);
    });
});


// Function to generate a new numeric Order ID
const getNewOrderIdFromDatabase = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT MAX(order_id) AS last_order_id FROM OrdersSR', (err, results) => {
            if (err) {
                reject(err);  // If there's an error, reject the promise
            } else {
                const lastOrderId = results[0].last_order_id || 0;
                const newOrderId = lastOrderId + 1;  // Increment the order_id
                resolve(newOrderId);  // Return the new numeric order ID
            }
        });
    });
};

// Example API endpoint to get a new formatted order ID
app.get('/api/generate-order-id', async (req, res) => {
    try {
        const newOrderId = await getNewOrderIdFromDatabase(); // Fetch new numeric order ID
        const formattedOrderId = `ORD${newOrderId.toString().padStart(3, '0')}`;  // Format it with 'ORD' prefix
        res.json({ order_id: formattedOrderId });  // Return the formatted new order ID as JSON
    } catch (error) {
        console.error('Error generating Order ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to create an order
app.post('/api/create-order', async (req, res) => {
    const {
        purchased_date,
        customer_code, 
        payment_ref_num, 
        delivery_date, 
        order_address, 
        city, 
        barangay, 
        order_receiver,
        sales_rep_id, 
        order_items // Array of order items
    } = req.body;

    // Validate input fields
    if (!customer_code || !delivery_date || !order_address || !city || !barangay || !order_receiver || !sales_rep_id || !order_items || order_items.length === 0) {
        return res.status(400).json({ success: false, error: "Missing required fields or order items" });
    }

    // Determine the status based on payment_ref_num
    const status = payment_ref_num ? 'paid' : 'pending';

    // Start a transaction
    db.beginTransaction(async (err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ success: false, error: 'Failed to start transaction' });
        }

        try {
            // Check if the customer exists
            const customerQuery = 'SELECT * FROM Customers WHERE customer_id = ?';
            db.query(customerQuery, [customer_code], async (customerErr, customerResults) => {
                if (customerErr) {
                    console.error('Error checking customer:', customerErr);
                    return db.rollback(() => {
                        res.status(500).json({ success: false, error: 'Error checking customer' });
                    });
                }

                if (customerResults.length === 0) {
                    // Customer doesn't exist, so insert a new customer
                    const newCustomerQuery = `
                        INSERT INTO Customers (customer_id, fname, lname, contact_num, email)
                        VALUES (?, ?, ?, ?, ?)`;
                    
                    const { first_name, last_name, contact_number, email_address } = req.body;

                    db.query(newCustomerQuery, [customer_code, first_name, last_name, contact_number, email_address], (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting customer:', insertErr);
                            return db.rollback(() => {
                                res.status(500).json({ success: false, error: 'Error inserting new customer' });
                            });
                        }

                        console.log('Customer inserted successfully');
                        proceedToCreateOrder();  // Proceed with order creation after customer is inserted
                    });
                } else {
                    // Customer exists, proceed with creating the order
                    proceedToCreateOrder();
                }
            });

            // Function to proceed with creating the order
            function proceedToCreateOrder() {
                // Generate new numeric order ID
                getNewOrderIdFromDatabase().then((newOrderId) => {
                    // Insert the order into the OrdersSR table (store numeric order_id)
                    const insertOrderQuery = `
                        INSERT INTO OrdersSR (order_id, purchased_date, customer_id, payment_ref_num, delivery_date, order_address, city, barangay, order_receiver, sales_rep_id,status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    db.query(insertOrderQuery, [
                        newOrderId,  // Use the numeric order ID
                        purchased_date,
                        customer_code, 
                        payment_ref_num, 
                        delivery_date, 
                        order_address, 
                        city, 
                        barangay, 
                        order_receiver,
                        sales_rep_id, 
                        status
                    ], (insertOrderErr) => {
                        if (insertOrderErr) {
                            console.error('Error inserting order:', insertOrderErr);
                            return db.rollback(() => {
                                res.status(500).json({ success: false, error: 'Error inserting order' });
                            });
                        }

                        console.log('Order inserted successfully');
                        
                        // Insert the order items
                        const insertOrderItemsQuery = `
                            INSERT INTO OrderDetails (order_id, product_id, quantity, unit_price, total_price)
                            VALUES (?, ?, ?, ?, ?)`;

                        const itemInsertions = order_items.map(item => {
                            const { product_id, quantity, unit_price } = item;
                            const total_price = quantity * unit_price; // Calculate total price

                            return new Promise((resolve, reject) => {
                                db.query(insertOrderItemsQuery, [newOrderId, product_id, quantity, unit_price, total_price], (insertItemErr) => {
                                    if (insertItemErr) {
                                        reject(insertItemErr);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        });

                        // Execute all item insertions and commit the transaction if successful
                        Promise.all(itemInsertions).then(() => {
                            db.commit((commitErr) => {
                                if (commitErr) {
                                    console.error('Error committing transaction:', commitErr);
                                    return db.rollback(() => {
                                        res.status(500).json({ success: false, error: 'Failed to commit transaction' });
                                    });
                                }

                                // Format the order ID with 'ORD' prefix and send the response
                                const formattedOrderId = `ORD${newOrderId.toString().padStart(3, '0')}`;
                                res.status(200).json({ success: true, order_id: formattedOrderId });
                            });
                        }).catch(insertItemErr => {
                            console.error('Error inserting order items:', insertItemErr);
                            return db.rollback(() => {
                                res.status(500).json({ success: false, error: 'Error inserting order items' });
                            });
                        });
                    });
                }).catch((err) => {
                    console.error('Error getting new order ID:', err);
                    return db.rollback(() => {
                        res.status(500).json({ success: false, error: 'Error generating new order ID' });
                    });
                });
            }
        } catch (error) {
            console.error('Error during order creation process:', error);
            return db.rollback(() => {
                res.status(500).json({ success: false, error: 'Error during order creation' });
            });
        }
    });
});

app.get('/api/order-details/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    
    const orderQuery = `
        SELECT 
            osr.order_id, 
            osr.customer_id, 
            osr.sales_rep_id, 
            osr.payment_ref_num, 
            DATE(osr.purchased_date) AS purchased_date,
            DATE(osr.delivery_date) AS delivery_date,
            osr.order_address, 
            osr.city, 
            osr.barangay, 
            osr.order_receiver,
            c.fname AS customer_first_name, 
            c.lname AS customer_last_name, 
            c.contact_num AS customer_contact, 
            c.email AS customer_email,
            sr.name AS sales_rep_name,
            sr.contact_info AS sales_rep_contactinfo
        FROM OrdersSR osr
        LEFT JOIN Customers c ON osr.customer_id = c.customer_id
        LEFT JOIN SalesRepresentatives sr ON osr.sales_rep_id = sr.sales_rep_id
        WHERE osr.order_id = ?;
    `;
    
    db.query(orderQuery, [orderId], (err, orderResults) => {
        if (err) {
            console.error('Error fetching order details:', err);
            return res.status(500).json({ message: 'Error fetching order details' });
        }

        console.log("Order Results:", orderResults);  // Log the results here

        if (orderResults.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order details for products
        const orderDetailQuery = `
            SELECT od.product_id, p.product_name, od.quantity, od.unit_price, od.total_price
            FROM OrderDetails od
            JOIN Products p ON od.product_id = p.product_id
            WHERE od.order_id = ?;
        `;

        db.query(orderDetailQuery, [orderId], (err, orderDetailResults) => {
            if (err) {
                console.error('Error fetching order details:', err);
                return res.status(500).json({ message: 'Error fetching order details' });
            }

            console.log("Order Detail Results:", orderDetailResults);  // Log order items

            res.json({
                order: orderResults[0],
                order_items: orderDetailResults
            });
        });
    });
});

app.get('/api/so-details/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    
    const orderQuery = `
        SELECT 
            osr.order_id, 
            osr.customer_id, 
            osr.sales_rep_id, 
            osr.payment_ref_num, 
            DATE(osr.delivery_date) AS delivery_date,
            osr.order_address, 
            osr.city, 
            osr.barangay, 
            osr.order_receiver,
            osr.inventory_status, -- Include inventory_status
            c.fname AS customer_first_name, 
            c.lname AS customer_last_name, 
            c.contact_num AS customer_contact, 
            c.email AS customer_email,
            sr.name AS sales_rep_name,
        FROM OrdersSR osr
        LEFT JOIN Customers c ON osr.customer_id = c.customer_id
        LEFT JOIN SalesRepresentatives sr ON osr.sales_rep_id = sr.sales_rep_id
        WHERE osr.order_id = ?;
    `;
    
    db.query(orderQuery, [orderId], (err, orderResults) => {
        if (err) {
            console.error('Error fetching order details:', err);
            return res.status(500).json({ message: 'Error fetching order details' });
        }

        console.log("Order Results:", orderResults);  // Log the results here

        if (orderResults.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order details for products
        const orderDetailQuery = `
            SELECT od.product_id, p.product_name, od.quantity, od.unit_price, od.total_price
            FROM OrderDetails od
            JOIN Products p ON od.product_id = p.product_id
            WHERE od.order_id = ?;
        `;

        db.query(orderDetailQuery, [orderId], (err, orderDetailResults) => {
            if (err) {
                console.error('Error fetching order details:', err);
                return res.status(500).json({ message: 'Error fetching order details' });
            }

            console.log("Order Detail Results:", orderDetailResults);  // Log order items

            res.json({
                order: orderResults[0],
                order_items: orderDetailResults
            });
        });
    });
});

app.post('/api/confirm-order/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    const updateOrderQuery = `
        UPDATE OrdersSR
        SET inventory_status = 'confirmed'
        WHERE order_id = ? AND inventory_status = 'pending';
    `;

    db.query(updateOrderQuery, [orderId], (err, result) => {
        if (err) {
            console.error('Error updating inventory status:', err);
            return res.status(500).json({ success: false, message: 'Failed to update order status' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: 'Order is already confirmed or does not exist' });
        }

        // Deduct inventory for all items in the order
        const updateInventoryQuery = `
            UPDATE Products p
            JOIN OrderDetails od ON p.product_id = od.product_id
            SET p.current_stock_level = p.current_stock_level - od.quantity
            WHERE od.order_id = ?;
        `;

        db.query(updateInventoryQuery, [orderId], (err, result) => {
            if (err) {
                console.error('Error updating inventory:', err);
                return res.status(500).json({ success: false, message: 'Failed to update inventory' });
            }

            res.json({ success: true });
        });
    });
});



// Function to convert MM/DD/YYYY to YYYY-MM-DD
function convertToDateFormat(dateString) {
    const [month, day, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

// API endpoint to fetch product details by productId
app.get('/api/product-details/:productId', (req, res) => {
    const productId = req.params.productId;
  
    // SQL query to fetch product details from Products table
    const query = `
      SELECT product_id, product_name, current_stock_level, expiration_date, reorder_level, stock_status, expiry_status
      FROM Products
      WHERE product_id = ?;
    `;
  
    db.execute(query, [productId], (err, results) => {
      if (err) {
        console.error('Error fetching product details:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      // Check if product exists
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Return the product details
      const product = results[0];
      res.json(product);
    });
  });

  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
