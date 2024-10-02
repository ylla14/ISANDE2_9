-- Dropping existing database if it exists
DROP DATABASE IF EXISTS ims;
CREATE DATABASE IF NOT EXISTS ims /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE ims;

-- Set session values for client, results, etc.
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES */;

-- Table structure for table Products
DROP TABLE IF EXISTS Products;
/*!40101 SET @saved_cs_client = @@character_set_client */;
CREATE TABLE Products (
  product_id VARCHAR(50) NOT NULL, 
  product_category VARCHAR(50) DEFAULT NULL,
  product_name VARCHAR(100) DEFAULT NULL,
  brand VARCHAR(50) DEFAULT NULL,
  pack_size VARCHAR(50) DEFAULT NULL,
  selling_price DECIMAL(10,2) DEFAULT NULL,
  expiration_date DATE DEFAULT NULL,
  description TEXT DEFAULT NULL,
  current_stock_level INT DEFAULT NULL,
  reorder_level INT DEFAULT NULL,
  min_order_quantity INT DEFAULT NULL,
  lead_time INT DEFAULT NULL, -- In days
  product_image VARCHAR(255) DEFAULT NULL, 
  PRIMARY KEY (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Inserting into Products table
LOCK TABLES Products WRITE;
/*!40000 ALTER TABLE Products DISABLE KEYS */;
INSERT INTO Products VALUES 
('PRD001', 'LENS', 'Contact Lens', 'Acuvue', '1 Box (6 Lenses)', 1200.00, '2025-12-31', 'Soft contact lenses for daily use', 150, 50, 20, 10, 'path/to/image1.jpg'),
('PRD002', 'GELS', 'Lubricating Gel', 'TheraTears', '100 ml', 500.00, '2024-08-15', 'Eye lubricating gel', 200, 60, 30, 15, 'path/to/image2.jpg');
/*!40000 ALTER TABLE Products ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table Suppliers
DROP TABLE IF EXISTS Suppliers;
/*!40101 SET @saved_cs_client = @@character_set_client */;
CREATE TABLE Suppliers (
  supplier_id VARCHAR(50) NOT NULL,
  supplier_name VARCHAR(100) DEFAULT NULL,
  contact_person VARCHAR(100) DEFAULT NULL,
  email_address VARCHAR(100) DEFAULT NULL,
  contact_details VARCHAR(150) DEFAULT NULL,
  physical_address TEXT DEFAULT NULL,
  mailing_address TEXT DEFAULT NULL,
  business_registration_number VARCHAR(50) DEFAULT NULL,
  contract_expiry_date DATE DEFAULT NULL,
  payment_terms VARCHAR(100) DEFAULT NULL,
  banking_details TEXT DEFAULT NULL,
  PRIMARY KEY (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Inserting into Suppliers table
LOCK TABLES Suppliers WRITE;
/*!40000 ALTER TABLE Suppliers DISABLE KEYS */;
INSERT INTO Suppliers VALUES 
('SUP001', 'Pharma Supplies Inc.', 'John Doe', 'john@pharmasupplies.com', '123-456-789', '123 Pharma St., Manila', 'PO Box 123, Manila', 'BRN12345', '2025-06-30', '30 days after delivery', 'Bank: BDO, Acc: 123456789'),
('SUP002', 'Medical Goods Co.', 'Jane Smith', 'jane@medicalgoods.com', '987-654-321', '456 Medical Ave., Cebu', 'PO Box 456, Cebu', 'BRN67890', '2024-12-31', '15 days after delivery', 'Bank: BPI, Acc: 987654321');
/*!40000 ALTER TABLE Suppliers ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table Customers
DROP TABLE IF EXISTS Customers;
/*!40101 SET @saved_cs_client = @@character_set_client */;
CREATE TABLE Customers (
  customer_id VARCHAR(50) NOT NULL,
  fname VARCHAR(50) DEFAULT NULL,
  lname VARCHAR(100) DEFAULT NULL,
  contact_num VARCHAR(150) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  street_number INT(4) DEFAULT NULL,
  street_name VARCHAR(100) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  region VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Inserting into Customers table
LOCK TABLES Customers WRITE;
/*!40000 ALTER TABLE Customers DISABLE KEYS */;
INSERT INTO Customers VALUES 
('CST001', 'John', 'Doe', '0917-123-4567', 'john.doe@email.com', 123, 'Main Street', 'Manila', 'NCR'),
('CST002', 'Jane', 'Smith', '0918-987-6543', 'jane.smith@email.com', 456, 'Elm Street', 'Cebu', 'Central Visayas');
/*!40000 ALTER TABLE Customers ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table SalesRepresentatives
DROP TABLE IF EXISTS SalesRepresentatives;
/*!40101 SET @saved_cs_client = @@character_set_client */;
CREATE TABLE SalesRepresentatives (
  sales_rep_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) DEFAULT NULL,
  contact_info VARCHAR(150) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  password VARCHAR(255) NOT NULL, 
  PRIMARY KEY (sales_rep_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Inserting into SalesRepresentatives table
LOCK TABLES SalesRepresentatives WRITE;
/*!40000 ALTER TABLE SalesRepresentatives DISABLE KEYS */;
INSERT INTO SalesRepresentatives VALUES 
('SR001', 'Anna Reyes', '0917-654-3210', 'anna.reyes@company.com', 'hashed_password_1'),
('SR002', 'Mark Dela Cruz', '0918-987-6543', 'mark.delacruz@company.com', 'hashed_password_2');
/*!40000 ALTER TABLE SalesRepresentatives ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table SalesOrders
DROP TABLE IF EXISTS SalesOrders;
/*!40101 SET @saved_cs_client = @@character_set_client */;
CREATE TABLE SalesOrders (
  order_id VARCHAR(50) NOT NULL,
  customer_id VARCHAR(50) DEFAULT NULL,
  sales_rep_id VARCHAR(50) DEFAULT NULL,
  product_id VARCHAR(50) NOT NULL,
  payment_reference_number VARCHAR(100) DEFAULT NULL,
  delivery_date DATE DEFAULT NULL,
  order_address TEXT DEFAULT NULL,
  order_receiver VARCHAR(100) DEFAULT NULL,
  order_date DATE DEFAULT NULL,
  PRIMARY KEY (order_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
  FOREIGN KEY (sales_rep_id) REFERENCES SalesRepresentatives(sales_rep_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Inserting into SalesOrders table
LOCK TABLES SalesOrders WRITE;
/*!40000 ALTER TABLE SalesOrders DISABLE KEYS */;
INSERT INTO SalesOrders VALUES 
('ORD001', 'CST001', 'SR001', 'PRD001', 'PAY12345', '2024-09-30', '123 Main Street, Manila, NCR', 'Dr. Santos', '2024-09-25'),
('ORD002', 'CST002', 'SR002', 'PRD002', 'PAY67890', '2024-10-01', '456 Elm Street, Cebu, Central Visayas', 'Dr. Cruz', '2024-09-26');
/*!40000 ALTER TABLE SalesOrders ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table PurchaseOrders
DROP TABLE IF EXISTS PurchaseOrders;
/*!40101 SET @saved_cs_client = @@character_set_client */;
CREATE TABLE PurchaseOrders (
  porder_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  supplier_id VARCHAR(50) NOT NULL,
  order_date DATE DEFAULT NULL,
  delivery_date DATE DEFAULT NULL,
  order_address TEXT DEFAULT NULL,
  unit_price DECIMAL(10,2) DEFAULT NULL,
  quantity INT,
  PRIMARY KEY (porder_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id),
  FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Inserting into PurchaseOrders table
LOCK TABLES PurchaseOrders WRITE;
/*!40000 ALTER TABLE PurchaseOrders DISABLE KEYS */;
INSERT INTO PurchaseOrders VALUES 
('PO001', 'PRD001', 'SUP001', '2024-09-20', '2024-09-25', '123 Pharma St., Manila', 1200.00, 100),
('PO002', 'PRD002', 'SUP002', '2024-09-21', '2024-09-27', '456 Medical Ave., Cebu', 500.00, 200);
/*!40000 ALTER TABLE PurchaseOrders ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table OrderDetails
-- might or might not remove this (for computation and tracking ng inventory pero it ight be redundant if pwede naman yung sales order nalang)

DROP TABLE IF EXISTS OrderDetails;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE OrderDetails (
  order_detail_id VARCHAR(50) NOT NULL, -- Non-auto incrementing ID
  order_id VARCHAR(50) NOT NULL, -- Foreign key to SalesOrders
  product_id VARCHAR(50) NOT NULL, -- Foreign key to Products (Ensure same type as Products table)
  quantity INT DEFAULT NULL,
  unit_price DECIMAL(10,2) DEFAULT NULL,
  total_price DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (order_detail_id),
  FOREIGN KEY (order_id) REFERENCES SalesOrders(order_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id) -- Same type and charset as Products table
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES OrderDetails WRITE;
/*!40000 ALTER TABLE OrderDetails DISABLE KEYS */;
INSERT INTO OrderDetails VALUES ('ORDD001', 'ORD001', 'PRD001', 10, 1200.00, 12000.00);
INSERT INTO OrderDetails VALUES ('ORDD002', 'ORD002', 'PRD002', 20, 500.00, 10000.00);
/*!40000 ALTER TABLE OrderDetails ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table SalesRepresentatives
--

DROP TABLE IF EXISTS InventoryManager;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE InventoryManager (
  inventory_manager_id VARCHAR(50) NOT NULL, -- Non-auto incrementing ID
  name VARCHAR(100) DEFAULT NULL,
  contact_info VARCHAR(150) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  password VARCHAR(255) NOT NULL, -- New password field
  PRIMARY KEY (inventory_manager_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES InventoryManager WRITE;
/*!40000 ALTER TABLE InventoryManager DISABLE KEYS */;
INSERT INTO InventoryManager VALUES ('IM001', 'Stacey Sevilleja', '0917-123-4567', 'stacey.sevilleja@company.com', 'IM_Password1');
/*!40000 ALTER TABLE InventoryManager ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;