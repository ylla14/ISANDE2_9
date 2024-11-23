const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const nodemailer = require("nodemailer");
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


  app.get('/api/salesorders', (req, res) => {
    const query = `
    SELECT 
        so.order_id,
        so.customer_id,
        so.sales_rep_id,
        so.payment_reference_number,
        so.delivery_date,
        so.order_address,
        so.order_receiver,
        so.order_date,
        COUNT(od.order_detail_id) AS total_products,
        SUM(od.total_price) AS total_order_value
    FROM 
        SalesOrders so
    LEFT JOIN 
        OrderDetails od ON so.order_id = od.order_id
    GROUP BY 
        so.order_id, 
        so.customer_id, 
        so.sales_rep_id, 
        so.payment_reference_number,
        so.delivery_date, 
        so.order_address, 
        so.order_receiver, 
        so.order_date
    `;
  
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving data from database');
            return;
        }
        res.json(results);
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
                        INSERT INTO OrdersSR (order_id, customer_id, payment_ref_num, delivery_date, order_address, city, barangay, order_receiver, sales_rep_id,status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    db.query(insertOrderQuery, [
                        newOrderId,  // Use the numeric order ID
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
             DATE(osr.delivery_date) AS delivery_date,
            osr.order_address, 
            osr.city, 
            osr.barangay, 
            osr.order_receiver,
            c.fname AS customer_first_name, 
            c.lname AS customer_last_name, 
            c.contact_num AS customer_contact, 
            c.email AS customer_email,
            sr.name AS sales_rep_name
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


app.post('/api/send-po', async (req, res) => {
    const { supplierId, orderDetails } = req.body;

    if (!supplierId || !orderDetails || !Array.isArray(orderDetails)) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        // Query to get the supplier's email based on the supplierId
        const supplierQuery = `
            SELECT 
                supplier_name, 
                email_address
            FROM Suppliers
            WHERE supplier_id = ?
        `;

        db.query(supplierQuery, [supplierId], async (err, results) => {
            if (err) {
                console.error('Error fetching supplier details:', err);
                return res.status(500).json({ error: 'Failed to fetch supplier details' });
            }

            if (!results.length) {
                return res.status(404).json({ error: 'Supplier not found' });
            }

            const supplier = results[0];
            const supplierEmail = supplier.email_address;
            const supplierName = supplier.supplier_name;

            // Construct the email content
            const orderTableRows = orderDetails.map(
                (order) => `
                <tr>
                    <td>${order.productName}</td>
                    <td>${order.category}</td>
                    <td>${order.quantity}</td>
                    <td>${order.unitPrice}</td>
                    <td>${order.totalPrice}</td>
                </tr>`
            ).join('');

            const emailBody = `
                <h1>Purchase Order Request</h1>
                <p>Dear ${supplierName},</p>
                <p>Please find the purchase order details below:</p>
                <table border="1" cellspacing="0" cellpadding="5">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderTableRows}
                    </tbody>
                </table>
                <p>Thank you,</p>
                <p>Your Company</p>
            `;

            // Nodemailer transport configuration
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // or your preferred email service
                auth: {
                    user: 'salgadoallyssa@gmail.com',
                    pass: 'eunchaePretty_214',
                },
            });

            // Email options
            const mailOptions = {
                from: 'salgadoallyssa@gmail.com',
                to: supplierEmail,
                subject: `Purchase Order Request from Your Company`,
                html: emailBody,
            };

            // Send the email
            try {
                await transporter.sendMail(mailOptions);
                res.status(200).json({ message: 'Purchase order sent successfully.' });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                res.status(500).json({ error: 'Failed to send the email.' });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});


  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

