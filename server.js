const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const PORT =  3000;

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
                            homepage: '/dashboardSR.html' // Redirect to Sales Representative dashboard
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
        p.expiration_date 
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
