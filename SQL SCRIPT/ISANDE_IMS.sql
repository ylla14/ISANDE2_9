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
('SUP001', 'Aurolab', 'John Doe', 'john@pharmasupplies.com', '123-456-789', '123 Pharma St., Manila', 'PO Box 123, Manila', 'BRN12345', '2025-06-30', '30 days after delivery', 'Bank: BDO, Acc: 123456789'),
('SUP002', 'Brady Super Block', 'Jane Smith', 'jane@medicalgoods.com', '987-654-321', '456 Medical Ave., Cebu', 'PO Box 456, Cebu', 'BRN67890', '2024-12-31', '15 days after delivery', 'Bank: BPI, Acc: 987654321'),
('SUP003', 'Oatsense', 'Jane Smith', 'jane@medicalgoods.com', '987-654-321', '456 Medical Ave., Cebu', 'PO Box 456, Cebu', 'BRN67890', '2024-12-31', '15 days after delivery', 'Bank: MetroBank, Acc: 987654321'),
('SUP004', 'Thioderm', 'John Doe', 'john@thioderm.com', '123-456-789', '123 Thioderm St., Manila', 'PO Box 123, Manila', 'BRN12345', '2024-12-31', '15 days after delivery', 'Bank: BPI, Acc: 123456789'),
('SUP005', 'Red Pharma', 'Alice Johnson', 'alice@redpharma.com', '234-567-890', '234 Red St., Manila', 'PO Box 234, Manila', 'BRN23456', '2024-12-31', '15 days after delivery', 'Bank: BDO, Acc: 234567890'),
('SUP006', 'Verdura', 'Robert Brown', 'robert@verdura.com', '345-678-901', '345 Verdura Rd., Manila', 'PO Box 345, Manila', 'BRN34567', '2024-12-31', '15 days after delivery', 'Bank: UnionBank, Acc: 345678901'),
('SUP007', 'Citriol', 'Emily White', 'emily@citriol.com', '456-789-012', '456 Citriol Ave., Manila', 'PO Box 456, Manila', 'BRN45678', '2024-12-31', '15 days after delivery', 'Bank: LandBank, Acc: 456789012'),
('SUP008', 'Brady Soap Bars', 'Michael Green', 'michael@bradysoap.com', '567-890-123', '567 Brady St., Manila', 'PO Box 567, Manila', 'BRN56789', '2024-12-31', '15 days after delivery', 'Bank: MetroBank, Acc: 567890123');
/*!40000 ALTER TABLE Suppliers ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table Products
DROP TABLE IF EXISTS Products;
/*!40101 SET @saved_cs_client = @@character_set_client */;
CREATE TABLE Products (
  product_id VARCHAR(50) NOT NULL, 
  product_category VARCHAR(50) DEFAULT NULL,
  product_name VARCHAR(100) DEFAULT NULL,
  supplier_id VARCHAR(50) DEFAULT NULL,
  pack_size VARCHAR(50) DEFAULT NULL,
  cost_price DECIMAL(10,2) DEFAULT NULL,
  selling_price DECIMAL(10,2) DEFAULT NULL,
  expiration_date DATE DEFAULT NULL,
  description TEXT DEFAULT NULL,
  current_stock_level INT DEFAULT NULL,
  reorder_level INT DEFAULT NULL,
  min_order_quantity INT DEFAULT NULL,
  lead_time INT DEFAULT NULL, -- In days
  product_image VARCHAR(255) DEFAULT NULL, 
  PRIMARY KEY (product_id),
  FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) -- This connects the Products to the Suppliers table
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Inserting into Products table
/*!40000 ALTER TABLE Products DISABLE KEYS */;
INSERT INTO Products (product_id, product_category, product_name, supplier_id, pack_size, cost_price, selling_price, expiration_date, description, current_stock_level, reorder_level, min_order_quantity, lead_time, product_image) VALUES
('AR001', 'LENS', 'PMMA Lenses Single/Three piece', 'SUP001', '1 pc', 550.00, 700.00, '2026-12-31', 'PMMA lenses for vision correction', 620, 500, 600, 14, 'path/to/image3.jpg'),
('AR002', 'LENS', 'PMMA Lenses Single - AC', 'SUP001', '1 pc', 750.00, 1000.00, '2026-12-31', 'Single-piece PMMA lenses', 650, 650, 600, 14, 'path/to/image4.jpg'),
('AR003', 'LENS', 'Scleral Fixation Lens', 'SUP001', '1 pc', 1600.00, 2000.00, '2026-12-31', 'Scleral fixation lens for special eye conditions', 700, 650, 600, 14, 'path/to/image5.jpg'),
('AR004', 'LENS', 'Aurovue EV Hydrophobic Preloaded IOL', 'SUP001', '1 pc', 3500.00, 4375.00, '2026-12-31', 'Hydrophobic foldable acrylic IOL', 800, 500, 600, 14, 'path/to/image6.jpg'),
('AR005', 'LENS', 'Aurovue (Multipiece Preloaded)', 'SUP001', '1 pc', 4250.00, 5313.00, '2026-12-31', 'Multipiece preloaded IOL lens', 900, 600, 650, 14, 'path/to/image7.jpg'),
('AR006', 'LENS', 'Aurovue Vivid EDOF Lens', 'SUP001', '1 pc', 22000.00, 27500.00, '2026-12-31', 'Extended depth of focus lens for eye surgery', 1000, 600, 650, 14, 'path/to/image8.jpg'),
('AR007', 'LENS', 'Aurovue Dfine Multifocal Lens', 'SUP001', '1 pc', 22000.00, 27500.00, '2026-12-31', 'Multifocal lens for cataract surgery', 1100, 700, 700, 14, 'path/to/image9.jpg'),
('AR008', 'GELS', 'Aurovisc', 'SUP001', '2 ml', 420.00, 525.00, '2028-12-31', 'HPMC 2% Pre-Filled Syringe', 750, 650, 600, 14, 'path/to/image10.jpg'),
('AR009', 'GELS', 'Aurogel', 'SUP001', '1 pc', 1250.00, 1563.00, '2026-12-31', 'Ophthalmic gel', 800, 600, 650, 14, 'path/to/image11.jpg'),
('AR010', 'GELS', 'Aurocoat', 'SUP001', '1 pc', 3500.00, 4375.00, '2026-12-31', 'Coating gel for eye surgery', 900, 650, 600, 14, 'path/to/image12.jpg'),
('AR011', 'SUTURES', 'Aurolon Sutures 6402N/T0-0 (model #1)', 'SUP001', '12', 5200.00, 6500.00, '2026-12-31', 'Aurolon Sutures model #1', 500, 650, 600, 12, 'path/to/image11.jpg'),
('AR012', 'SUTURES', 'Aurolon Sutures 6492N/9-0 (model #2)', 'SUP001', '12', 5200.00, 6500.00, '2026-12-31', 'Aurolon Sutures model #2', 500, 550, 600, 12, 'path/to/image12.jpg'),
('AR013', 'SUTURES', 'Aurolon Sutures NO204/10-0 Taper Point (model #3)', 'SUP001', '12', 8500.00, 10625.00, '2026-12-31', 'Aurolon Sutures model #3', 500, 500, 600, 12, 'path/to/image13.jpg'),
('AR014', 'SUTURES', 'Aurobond Sutures (Single Arm) E4101/4-0 (model #1)', 'SUP001', '12', 10600.00, 13250.00, '2026-12-31', 'Aurobond Sutures Single Arm model #1', 730, 500, 600, 12, 'path/to/image14.jpg'),
('AR015', 'SUTURES', 'Aurobond Sutures (Single Arm) E5101/5-0 (model #2)', 'SUP001', '12', 10600.00, 13250.00, '2026-12-31', 'Aurobond Sutures Single Arm model #2', 610, 650, 600, 12, 'path/to/image15.jpg'),
('AR016', 'SUTURES', 'Aurobond Sutures (Double Arm) E4101/4-0 (model #1)', 'SUP001', '12', 10600.00, 13250.00, '2026-12-31', 'Aurobond Sutures Double Arm model #1', 700, 600, 600, 12, 'path/to/image16.jpg'),
('AR017', 'SUTURES', 'Aurobond Sutures (Double Arm) E5101/5-0 (model #2)', 'SUP001', '12', 10600.00, 13250.00, '2026-12-31', 'Aurobond Sutures Double Arm model #2', 850, 500, 600, 12, 'path/to/image17.jpg'),
('AR018', 'SUTURES', 'Aurolene Sutures AS-000-6 Straight Double Arm (9-0/10-0)', 'SUP001', '12', 14500.00, 18125.00, '2026-12-31', 'Aurolene Sutures Straight Double Arm model', 500, 500, 600, 12, 'path/to/image18.jpg'),
('AR019', 'SUTURES', 'Aurolene Sutures AS-160-6 Double Arm (10-0)', 'SUP001', '12', 14500.00, 18125.00, '2026-12-31', 'Aurolene Sutures Double Arm model', 550, 800, 600, 12, 'path/to/image19.jpg'),
('AR020', 'SUTURES', 'Polycryl Absorbable Sutures A6108/6-0', 'SUP001', '12', 9750.00, 12200.00, '2026-12-31', 'Polycryl Absorbable Sutures model A6108/6-0', 600, 750, 600, 12, 'path/to/image20.jpg'),
('AR021', 'SUTURES', 'Polycryl Absorbable Sutures A7102/7-0', 'SUP001', '12', 9750.00, 12200.00, '2026-12-31', 'Polycryl Absorbable Sutures model A7102/7-0', 650, 700, 600, 12, 'path/to/image21.jpg'),
('AR022', 'SUTURES', 'Polycryl Absorbable Sutures A8104/8-0', 'SUP001', '12', 9750.00, 12200.00, '2026-12-31', 'Polycryl Absorbable Sutures model A8104/8-0', 700, 600, 600, 12, 'path/to/image22.jpg'),
('AR023', 'SUTURES', 'Polycryl Absorbable Sutures A0101/10-0', 'SUP001', '12', 9750.00, 12200.00, '2026-12-31', 'Polycryl Absorbable Sutures model A0101/10-0', 750, 550, 600, 12, 'path/to/image23.jpg'),
('AR024', 'DYE SOLUTION', 'Auroblue', 'SUP001', '5 x 1ml', 1350.00, 1690.00, '2026-12-31', 'Trypan Blue dye solution', 800, 900, 600, 12, 'path/to/image24.jpg'),
('AR025', 'DYE SOLUTION', 'Ocublue Plus', 'SUP001', '5 x 1ml', 7500.00, 9375.00, '2026-12-31', 'Brilliant Blue G Solution 0.05%', 850, 850, 600, 12, 'path/to/image25.jpg'),
('AR026', 'DYE SOLUTION', 'Aurogreen', 'SUP001', '25mg', 5500.00, 6875.00, '2026-12-31', 'Indocycine Green 0.5%', 900, 800, 600, 12, 'path/to/image26.jpg'),
('AR027', 'DYE SOLUTION', 'Flures', 'SUP001', '10 x 3ml', 3750.00, 4700.00, '2026-12-31', 'Fluorescein Injection USP 20% w/v', 950, 700, 600, 12, 'path/to/image27.jpg'),
('AR028', 'AUROSLEEK', 'Surgical Blade Keratome', 'SUP001', '1 pc', 350.00, 440.00, '2026-12-31', 'Surgical Blade Keratome', 600, 650, 600, 12, 'path/to/image28.jpg'),
('AR029', 'AUROSLEEK', 'Surgical Blade Crescent', 'SUP001', '1 pc', 350.00, 440.00, '2026-12-31', 'Surgical Blade Crescent', 650, 600, 600, 12, 'path/to/image29.jpg'),
('AR030', 'AUROSLEEK', 'Surgical Blade Side Port', 'SUP001', '1 pc', 350.00, 440.00, '2026-12-31', 'Surgical Blade Side Port', 700, 580, 600, 12, 'path/to/image30.jpg'),
('AR031', 'RETINA', 'Aurosil 1000 Cst Silicone Oil', 'SUP001', '10ml', 4500.00, 5625.00, '2026-12-31', '1000 Cst Silicone Oil', 800, 700, 600, 12, 'path/to/image31.jpg'),
('AR032', 'RETINA', 'Aurosil 1500 Cst Silicone Oil', 'SUP001', '10ml', 6000.00, 7500.00, '2026-12-31', '1500 Cst Silicone Oil', 850, 600, 600, 12, 'path/to/image32.jpg'),
('AR033', 'RETINA', 'Aurocort', 'SUP001', '5 x 1ml', 3300.00, 4125.00, '2026-12-31', 'Triamcinolone Acetonide 4% suspension', 700, 700, 600, 12, 'path/to/image33.jpg'),
('AR034', 'ORBIT & OCULOPLASTY', 'Aurosling Ptosis sling', 'SUP001', '1 pc', 5750.00, 7190.00, '2026-12-31', 'Ptosis sling', 600, 550, 600, 12, 'path/to/image34.jpg'),
('AR035', 'ORBIT & OCULOPLASTY', 'Aurolac Lacrimal Intubation Set', 'SUP001', '1 pc', 2600.00, 3250.00, '2026-12-31', 'Lacrimal Intubation Set', 650, 600, 600, 12, 'path/to/image35.jpg'),
('AR036', 'GLAUCOMA', 'AADI', 'SUP001', '1 pc', 11500.00, 14375.00, '2026-12-31', 'Glaucoma shunt', 700, 550, 600, 12, 'path/to/image36.jpg'),
('AR037', 'EYEDROPS', 'Aurosol', 'SUP001', '10ml', 220.00, 275.00, '2026-12-31', 'Eyedrops', 650, 600, 700, 12, 'path/to/image37.jpg'),
('AR038', 'EYEDROPS', 'Tob-Dex', 'SUP001', '5ml', 225.00, 282.00, '2026-12-31', 'Eyedrops', 720, 600, 700, 12, 'path/to/image38.jpg'),
('AR039', 'EYEDROPS', 'Auropred', 'SUP001', '10ml', 225.00, 285.00, '2026-12-31', 'Eyedrops', 590, 550, 600, 12, 'path/to/image39.jpg'),
('AR040', 'EYEDROPS', 'Aurocaine', 'SUP001', '5ml', 210.00, 270.00, '2026-12-31', 'Eyedrops', 680, 600, 700, 12, 'path/to/image40.jpg'),
('AR041', 'EYEDROPS', 'Auromide Plus', 'SUP001', '5ml', 290.00, 365.00, '2026-12-31', 'Eyedrops', 750, 620, 720, 12, 'path/to/image41.jpg'),
('AR042', 'EYEDROPS', 'Auropent', 'SUP001', '5ml', 250.00, 315.00, '2026-12-31', 'Eyedrops', 580, 550, 600, 12, 'path/to/image42.jpg'),
('AR043', 'EYEDROPS', 'Vozole', 'SUP001', '30mg', 975.00, 1220.00, '2026-12-31', 'Eyedrops', 500, 520, 600, 12, 'path/to/image43.jpg'),
('AR044', 'EYEDROPS', 'Vozole - PF', 'SUP001', '1 mg', 975.00, 1220.00, '2026-12-31', 'Eyedrops', 550, 530, 610, 12, 'path/to/image44.jpg'),
('AR045', 'EYEDROPS', 'Ocuchol', 'SUP001', '5 x 1ml', 875.00, 1095.00, '2026-12-31', 'Eyedrops', 490, 510, 600, 12, 'path/to/image45.jpg'),
('AR046', 'EYEDROPS', 'Auromox', 'SUP001', '5 x 1ml', 1250.00, 1563.00, '2026-12-31', 'Eyedrops', 600, 580, 650, 12, 'path/to/image46.jpg'),
('AR047', 'EYEDROPS', 'Aurodone', 'SUP001', '5ml', 250.00, 313.00, '2026-12-31', 'Eyedrops', 630, 540, 640, 12, 'path/to/image47.jpg'),
('AR048', 'EYEDROPS', 'Blephagiene Eyelid Cleanser', 'SUP001', '50ml', 410.00, 512.50, '2026-12-31', 'Eyelid Cleanser', 590, 580, 620, 12, 'path/to/image48.jpg'),
('SB001', 'BRADY SUPER BLOCK', '1 Liter', 'SUP002', '1 Liter', 7500.00, 7500.00, '2026-12-31', NULL, 700, 600, 800, 12, 'path/to/image48.jpg'),
('SB002', 'BRADY SUPER BLOCK', 'Jar Silverlining', 'SUP002', '50', 7250.00, 7250.00, '2026-12-31', NULL, 750, 600, 800, 12, 'path/to/image48.jpg'),
('SB003', 'BRADY SUPER BLOCK', 'Gel pump', 'SUP002', '33', 7250.00, 7250.00, '2026-12-31', NULL, 600, 550, 700, 12, 'path/to/image48.jpg'),
('SB004', 'BRADY SUPER BLOCK', 'Cosmetic Jar', 'SUP002', '20', 7250.00, 7250.00, '2026-12-31', NULL, 640, 600, 700, 12, 'path/to/image48.jpg'),
('SB005', 'BRADY SUPER BLOCK', 'Clear Bottle w/ Fliptop Cap 50ml', 'SUP002', '20', 7250.00, 7250.00, '2026-12-31', NULL, 570, 550, 600, 12, 'path/to/image48.jpg'),
('SB006', 'BRADY SUPER BLOCK', 'Clear Bottle w/ Fliptop Cap 100ml', 'SUP002', '10', 7250.00, 7250.00, '2026-12-31', NULL, 500, 520, 600, 12, 'path/to/image48.jpg'),
('SB007', 'BRADY SUPER BLOCK', 'Clear Bottle w/ Pump 125ml', 'SUP002', '8', 7500.00, 7250.00, '2026-12-31', NULL, 600, 550, 650, 12, 'path/to/image48.jpg'),
('SB008', 'BRADY SUPER BLOCK', 'Clear Bottle w/ Pump 250ml', 'SUP002', '4', 7500.00, 7250.00, '2026-12-31', NULL, 520, 500, 600, 12, 'path/to/image48.jpg'),
('SB009', 'BRADY SUPER BLOCK PROMOS', '5 + 1 Liter', 'SUP002', '6 Liter', 28125.00, 28125.00, '2026-12-31', NULL, 590, 550, 650, 12, 'path/to/image48.jpg'),
('SB010', 'BRADY SUPER BLOCK PROMOS', 'Jar Silverlining', 'SUP002', '250 + 50', 28750.00, 28750.00, '2026-12-31', NULL, 610, 580, 660, 12, 'path/to/image48.jpg'),
('SB011', 'BRADY SUPER BLOCK PROMOS', 'Gel pump', 'SUP002', '166 + 33', 28750.00, 28750.00, '2026-12-31', NULL, 620, 570, 680, 12, 'path/to/image48.jpg'),
('SB012', 'BRADY SUPER BLOCK PROMOS', 'Cosmetic Jar', 'SUP002', '100 + 20', 28750.00, 28750.00, '2026-12-31', NULL, 580, 550, 660, 12, 'path/to/image48.jpg'),
('SB013', 'BRADY SUPER BLOCK PROMOS', 'Clear Bottle w/ Fliptop Cap 50ml', 'SUP002', '100 + 20', 28750.00, 28750.00, '2026-12-31', NULL, 650, 620, 700, 12, 'path/to/image48.jpg'),
('SB014', 'BRADY SUPER BLOCK PROMOS', 'Clear Bottle w/ Fliptop Cap 100ml', 'SUP002', '50 + 10 ', 28750.00, 28750.00, '2026-12-31', NULL, 640, 600, 680, 12, 'path/to/image48.jpg'),
('SB015', 'BRADY SUPER BLOCK PROMOS', 'Clear Bottle w/ Pump 125ml', 'SUP002', '40 + 8 ', 28750.00, 28750.00, '2026-12-31', NULL, 570, 540, 620, 12, 'path/to/image48.jpg'),
('OT001', 'MOUSTURISER', '1 Liter', 'SUP003', NULL, 3515.00, 3515.00, '2026-12-31', NULL, 550, 520, 600, 12, 'path/to/image48.jpg'),
('OT002', 'MOUSTURISER', 'Pump bottle with Box 250ml', 'SUP003', NULL, 3515.00, 3515.00, '2026-12-31', NULL, 600, 580, 600, 12, 'path/to/image48.jpg'),
('OT003', 'MOUSTURISER', 'Pump bottle with Box 500ml', 'SUP003', NULL, 3515.00, 3515.00, '2026-12-31', NULL, 700, 650, 600, 12, 'path/to/image48.jpg'),
('OT004', 'MOUSTURISER', 'Pump bottle', 'SUP003', '8', 3450.00, 3450.00, '2026-12-31', NULL, 800, 600, 600, 12, 'path/to/image48.jpg'),
('OT005', 'MOUSTURISER', 'Fliptop Bottle 50ml', 'SUP003', '20', 3450.00, 3450.00, '2026-12-31', NULL, 650, 550, 600, 12, 'path/to/image48.jpg'),
('OT006', 'MOUSTURISER', 'Fliptop Bottle 100ml', 'SUP003', '10', 3450.00, 3450.00, '2026-12-31', NULL, 600, 500, 600, 12, 'path/to/image48.jpg'),
('OT007', 'MOUSTURISER PROMO', '5 liters + 1 liter', 'SUP003', NULL, 12500.00, 12500.00, '2026-12-31', NULL, 900, 700, 600, 12, 'path/to/image48.jpg'),
('OT008', 'MOUSTURISER PROMO', 'Pump Bottlee', 'SUP003', '40 + 8', 11250.00, 11250.00, '2026-12-31', NULL, 800, 600, 600, 12, 'path/to/image48.jpg'),
('OT009', 'MOUSTURISER PROMO', 'Fliptop Bottle 50ml', 'SUP003', '100 + 20', 11250.00, 11250.00, '2026-12-31', NULL, 850, 640, 600, 12, 'path/to/image48.jpg'),
('OT010', 'MOUSTURISER PROMO', 'Fliptop Bottle 100ml', 'SUP003', '40 + 10 ', 11250.00, 11250.00, '2026-12-31', NULL, 900, 650, 600, 12, 'path/to/image48.jpg'),
('OT011', 'SOAP FREE WASH', '1 Liter', 'SUP003', NULL, 3515.00, 3515.00, '2026-12-31', NULL, 600, 570, 600, 12, 'path/to/image48.jpg'),
('OT012', 'SOAP FREE WASH', 'Pump bottle with Box 250ml', 'SUP003', NULL, 3515.00, 3515.00, '2026-12-31', NULL, 700, 650, 600, 12, 'path/to/image48.jpg'),
('OT013', 'SOAP FREE WASH', 'Pump bottle with Box 500ml', 'SUP003', NULL, 3515.00, 3515.00, '2026-12-31', NULL, 800, 700, 600, 12, 'path/to/image48.jpg'),
('OT014', 'SOAP FREE WASH', 'Pump bottle', 'SUP003', '8', 3450.00, 3450.00, '2026-12-31', NULL, 750, 600, 600, 12, 'path/to/image48.jpg'),
('OT015', 'SOAP FREE WASH', 'Fliptop Bottle 50ml', 'SUP003', '20', 3450.00, 3450.00, '2026-12-31', NULL, 600, 550, 600, 12, 'path/to/image48.jpg'),
('OT016', 'SOAP FREE WASH', 'Fliptop Bottle 100ml', 'SUP003', '10', 3450.00, 3450.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT017', 'SOAP FREE WASH PROMO', '5 liters + 1 liter', 'SUP003', NULL, 12500.00,12500.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT018', 'SOAP FREE WASH PROMO', 'Pump Bottlee', 'SUP003', '40 + 8', 11250.00, 11250.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT019', 'MOUSTURISER PROMO', 'Fliptop Bottle 50ml', 'SUP003', '100 + 20', 11250.00, 11250.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT020', 'MOUSTURISER PROMO', 'Fliptop Bottle 100ml', 'SUP003', '40 + 10 ', 11250.00, 11250.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT021', 'SHOWER AND BATH OIL', '1 Liter', 'SUP003', NULL, 5600.00, 5600.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT022', 'SHOWER AND BATH OIL', 'Pump bottle', 'SUP003', '8', 5120.00, 5120.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT023', 'SHOWER AND BATH OIL', 'Fliptop Bottle 50ml', 'SUP003', '20', 5120.00, 5120.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT024', 'SHOWER AND BATH OIL', 'Fliptop Bottle 100ml', 'SUP003', '10', 5120.00, 5120.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT025', 'SHOWER AND BATH OIL PROMO', '5 + 1 Liter', 'SUP003', NULL, 20000.00, 20000.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT026', 'SHOWER AND BATH OIL PROMO', 'Pump bottle', 'SUP003', '40+8', 17500.00, 17500.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT027', 'SHOWER AND BATH OIL PROMO', 'Fliptop Bottle 50ml', 'SUP003', '100 + 20', 17500.00, 17500.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('OT028', 'SHOWER AND BATH OIL PROMO', 'Fliptop Bottle 100ml', 'SUP003', '40 + 10', 17500.00, 17500.00, '2026-12-31', NULL, 500, 500, 600, 12, 'path/to/image48.jpg'),
('TH001', 'THIODERM', 'Thioderm', 'SUP004', '30 lozenges', 2800.00, 3900.00, NULL, NULL, 800, 550, 600, 14, 'path/to/image_thioderm.jpg'),
('RP001', 'RED PHARMA', 'Calmapherol Regular', 'SUP005', '55 ml', 1100.00, 1375.00, NULL, NULL, 700, 520, 600, 14, 'path/to/image_calmapherol_regular.jpg'),
('RP002', 'RED PHARMA', 'Calmapherol S.C. Cream', 'SUP005', '20 grams', 990.00, 1250.00, NULL, NULL, 800, 530, 600, 14, 'path/to/image_calmapherol_sc_cream.jpg'),
('RP003', 'RED PHARMA', 'Calmapherol S.C. Ointment', 'SUP005', '20 grams', 990.00, 1250.00, NULL, NULL, 750, 510, 600, 14, 'path/to/image_calmapherol_sc_ointment.jpg'),
('RP004', 'RED PHARMA', 'Calmapherol S.C. GLA Balm', 'SUP005', '120 ml', 1100.00, 1375.00, NULL, NULL, 600, 540, 600, 14, 'path/to/image_calmapherol_gla_balm.jpg'),
('RP005', 'RED PHARMA', 'Celip Duo Cream', 'SUP005', '5 grams', 750.00, 940.00, NULL, NULL, 650, 580, 600, 14, 'path/to/image_celip_duo_cream.jpg'),
('VD001', 'VERDURA', 'Psoronorm Cell Repair Oil', 'SUP006', '100 ml', 875.00, 1095.00, NULL, NULL, 700, 590, 550, 14, 'path/to/image_psoronorm_cell_repair_oil.jpg'),
('VD002', 'VERDURA', 'Cell Repair Cream', 'SUP006', '75 g', 875.00, 1095.00, NULL, NULL, 600, 600, 600, 14, 'path/to/image_cell_repair_cream.jpg'),
('VD003', 'VERDURA', 'Skin Fresh Intense Moisturizing Bar', 'SUP006', '75 g', 225.00, 300.00, NULL, NULL, 800, 620, 600, 14, 'path/to/image_skin_fresh_intense_moisturizing_bar.jpg'),
('VD004', 'VERDURA', 'Anti Scalling Scalp Shampoo', 'SUP006', '200 ml', 1350.00, 1690.00, NULL, NULL, 750, 590, 650, 14, 'path/to/image_anti_scaling_scalp_shampoo.jpg'),
('VD005', 'VERDURA', 'Mela Pro', 'SUP006', '75 g', 990.00, 1250.00, NULL, NULL, 700, 610, 600, 14, 'path/to/image_mela_pro_75g.jpg'),
('VD006', 'VERDURA', 'Mela Pro', 'SUP006', '35 g', 575.00, 720.00, NULL, NULL, 650, 630, 600, 14, 'path/to/image_mela_pro_35g.jpg'),
('VD007', 'VERDURA', 'Melagain Cream', 'SUP006', '75 g', 1250.00, 1565.00, NULL, NULL, 680, 640, 600, 14, 'path/to/image_melagain_cream.jpg'),
('CT001', 'CITRIOL', 'Citriol Ointment', 'SUP007', '30 g', 800.00, 1000.00, NULL, NULL, 600, 560, 800, 14, 'path/to/image_citriol_ointment.jpg'),
('CT002', 'CITRIOL', 'Citriol Hair Gel', 'SUP007', '30 g', 450.00, 650.00, NULL, NULL, 550, 570, 600, 14, 'path/to/image_citriol_hair_gel.jpg'),
('BR001', 'BRADY SOAP BARS', 'Thioderm Skin Lightening Bar', 'SUP008', '90 gm', 175.00, 220.00, NULL, NULL, 600, 520, 550, 14, 'path/to/image_thioderm_skin_lightening_bar.jpg'),
('BR002', 'BRADY SOAP BARS', 'Dermaguard Transparent Moisturizing Bar', 'SUP008', '90 gm', 175.00, 220.00, NULL, NULL, 700, 530, 600, 14, 'path/to/image_dermaguard_transparent_moisturizing_bar.jpg'),
('BR003', 'BRADY SOAP BARS', 'Dermaguard Skin Care Bar', 'SUP008', '90 gm', 160.00, 200.00, NULL, NULL, 650, 540, 600, 14, 'path/to/image_dermaguard_skin_care_bar.jpg'),
('BR004', 'BRADY SOAP BARS', 'Dermaguard Bar for Oily Skin', 'SUP008', '90 gm', 160.00, 200.00, NULL, NULL, 600, 550, 550, 14, 'path/to/image_dermaguard_bar_for_oily_skin.jpg'),
('BR005', 'BRADY SOAP BARS', 'Dermaguard Hygiene Bar', 'SUP008', '90 gm', 160.00, 200.00, NULL, NULL, 650, 560, 600, 14, 'path/to/image_dermaguard_hygiene_bar.jpg'),
('BR006', 'BRADY SOAP BARS', 'Oatsense Oatmeal Moisturizing Bar', 'SUP008', '90 gm', 160.00, 200.00, NULL, NULL, 700, 570, 600, 14, 'path/to/image_oatsense_oatmeal_moisturizing_bar.jpg'),
('BR007', 'BRADY SOAP BARS', 'Pediaguard Baby Bathing Bar', 'SUP008', '90 gm', 160.00, 200.00, NULL, NULL, 600, 580, 550, 14, 'path/to/image_pediaguard_baby_bathing_bar.jpg');

/*!40000 ALTER TABLE Products ENABLE KEYS */;
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

DROP TABLE IF EXISTS SalesOrders;
CREATE TABLE SalesOrders (
  order_id VARCHAR(50) NOT NULL,
  customer_id VARCHAR(50) DEFAULT NULL,
  sales_rep_id VARCHAR(50) DEFAULT NULL,
  payment_reference_number VARCHAR(100) DEFAULT NULL,
  delivery_date DATE DEFAULT NULL,
  order_address TEXT DEFAULT NULL,
  order_receiver VARCHAR(100) DEFAULT NULL,
  order_date DATE DEFAULT NULL,
  PRIMARY KEY (order_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
  FOREIGN KEY (sales_rep_id) REFERENCES SalesRepresentatives(sales_rep_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES SalesOrders WRITE;
/*!40000 ALTER TABLE SalesOrders DISABLE KEYS */;
INSERT INTO SalesOrders VALUES 
('ORD001', 'CST001', 'SR001', 'PAY12345', '2024-09-30', '123 Main Street, Manila, NCR', 'Dr. Santos', '2024-09-25'),
('ORD002', 'CST002', 'SR002', 'PAY67890', '2024-10-01', '456 Elm Street, Cebu, Central Visayas', 'Dr. Cruz', '2024-09-26');
/*!40000 ALTER TABLE SalesOrders ENABLE KEYS */;
UNLOCK TABLES;

-- Drop existing tables
DROP TABLE IF EXISTS PurchaseOrders;
DROP TABLE IF EXISTS PurchaseOrderDetails;

-- Create PurchaseOrders table
CREATE TABLE PurchaseOrders (
  porder_id VARCHAR(50) NOT NULL,
  supplier_id VARCHAR(50) NOT NULL,
  order_date DATE DEFAULT NULL,
  delivery_date DATE DEFAULT NULL,
  order_address TEXT DEFAULT NULL,
  PRIMARY KEY (porder_id),
  FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
UNLOCK TABLES;

-- Create OrderDetails table for PurchaseOrders
CREATE TABLE PurchaseOrderDetails (
  order_detail_id VARCHAR(50) NOT NULL,
  porder_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,2) DEFAULT NULL,
  quantity INT DEFAULT NULL,
  total_price DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (order_detail_id),
  FOREIGN KEY (porder_id) REFERENCES PurchaseOrders(porder_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
UNLOCK TABLES;

LOCK TABLES PurchaseOrders WRITE, PurchaseOrderDetails WRITE;
/*!40000 ALTER TABLE PurchaseOrders DISABLE KEYS */;

INSERT INTO PurchaseOrders VALUES 
('PO001', 'SUP001', '2024-09-20', '2024-09-25', '123 Pharma St., Manila'),
('PO002', 'SUP002', '2024-09-21', '2024-09-27', '456 Medical Ave., Cebu');
/*!40000 ALTER TABLE PurchaseOrders ENABLE KEYS */;

INSERT INTO PurchaseOrderDetails VALUES
('POD001', 'PO001', 'AR001', 1200.00, 100, 120000.00), -- Details for PO001
('POD002', 'PO002', 'AR002', 500.00, 200, 100000.00); -- Details for PO002
UNLOCK TABLES;
--
-- Table structure for table OrderDetails
-- might or might not remove this (for computation and tracking ng inventory pero it ight be redundant if pwede naman yung sales order nalang)

DROP TABLE IF EXISTS OrderDetails;
CREATE TABLE OrderDetails (
  order_detail_id VARCHAR(50) NOT NULL,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity INT DEFAULT NULL,
  unit_price DECIMAL(10,2) DEFAULT NULL,
  total_price DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (order_detail_id),
  FOREIGN KEY (order_id) REFERENCES SalesOrders(order_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES OrderDetails WRITE;
INSERT INTO OrderDetails VALUES
('OD001', 'ORD001', 'AR001', 10, 250.00, 2500.00), -- 10 units of AR001 in order ORD001
('OD002', 'ORD001', 'AR002', 5, 300.00, 1500.00),  -- 5 units of AR002 in order ORD001
('OD003', 'ORD001', 'AR001', 3, 250.00, 750.00), -- 3 more units of AR001 in order ORD001
('OD004', 'ORD002', 'SB003', 15, 300.00, 4500.00);
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

-- Table structure for OrdersSR
DROP TABLE IF EXISTS OrdersSR;
CREATE TABLE OrdersSR (
  order_id VARCHAR(50) NOT NULL,
  purchased_date DATE DEFAULT NULL, 
  customer_id VARCHAR(50) NOT NULL,
  payment_ref_num VARCHAR(50) DEFAULT NULL,
  delivery_date DATE DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  barangay VARCHAR(100) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  order_receiver VARCHAR(100) DEFAULT NULL,
  qty INT DEFAULT NULL,
  brand_name VARCHAR(50) DEFAULT NULL,
  category_name VARCHAR(50) DEFAULT NULL,
  product_name VARCHAR(50) DEFAULT NULL,
  unit_price DECIMAL(10, 2) DEFAULT NULL,
  total_price DECIMAL(10, 2) DEFAULT NULL,
  PRIMARY KEY (order_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Example Insert
INSERT INTO OrdersSR (
  order_id, purchased_date, customer_id, payment_ref_num, delivery_date, city, barangay, address, 
  order_receiver, qty, brand_name, category_name, product_name, unit_price, total_price 
) VALUES 
('ORD001', CURDATE(), 'CST001', 'PAY12345', '2024-11-01', 'Manila', 'Ermita', '123 Main Street', 'John Doe', 
  10, 'Big Brand', 'Food', 'Burger', 50.00, 500.00); 



/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;