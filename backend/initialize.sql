-- John DeRusso & Joseph Doiron
-- Project Group 12
-- Project Step 3 Draft Version
-- CS 340 - Spring 2022

-- Data Definition Queries

USE cs340_doironj;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP TABLE IF EXISTS `Customers`;
DROP TABLE IF EXISTS `Employees`;
DROP TABLE IF EXISTS `Locations`;
DROP TABLE IF EXISTS `Models`;
DROP TABLE IF EXISTS `Sales`;
DROP TABLE IF EXISTS `Sales_has_Customers`;
DROP TABLE IF EXISTS `Vehicles`;

CREATE TABLE `Customers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `street` varchar(200) NOT NULL,
  `apartment` varchar(50) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` char(2) NOT NULL,
  `zip` char(5) NOT NULL,
  `telephone` char(10) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_date` date NOT NULL
) ENGINE = innoDB;

CREATE TABLE `Employees` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `type` varchar(5) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `work_telephone` char(10) NOT NULL,
  `work_email` varchar(100) NOT NULL,
  `hire_date` date NOT NULL,
  `termination_date` date DEFAULT '9999-12-31'
) ENGINE = innoDB;

CREATE TABLE `Locations` (
  `id` int(11) NOT NULL,
  `code` varchar(5) NOT NULL,
  `street` varchar(200) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` char(2) NOT NULL,
  `zip` char(5) NOT NULL,
  `telephone` char(10) NOT NULL
);

CREATE TABLE `Models` (
  `id` int(11) NOT NULL,
  `manufacturer` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `model_year` year(4) NOT NULL,
  `generation` int(11) NOT NULL,
  `body_style_code` varchar(5) NOT NULL
) ENGINE = innoDB;

CREATE TABLE `Sales` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `purchase_price` decimal(15,2) NOT NULL
) ENGINE = innoDB;

CREATE TABLE `Sales_has_Customers` (
  `sale_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL
) ENGINE = innoDB;

CREATE TABLE `Vehicles` (
  `id` int(11) NOT NULL,
  `location_id` int(11),
  `model_id` int(11) NOT NULL,
  `vin` varchar(100) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `trim` varchar(50) DEFAULT NULL,
  `mileage` int(11) NOT NULL,
  `is_used` tinyint(1) NOT NULL,
  `date_acquired` date NOT NULL,
  `price_paid` decimal(15,2) NOT NULL,
  `msrp` decimal(15,2) NOT NULL
) ENGINE = innoDB;

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Customer_id_UNIQUE` (`id`);

--
-- Indexes for table `Employees`
--
ALTER TABLE `Employees`
  ADD PRIMARY KEY (`id`,`location_id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_Employees_Locations1_idx` (`location_id`);

--
-- Indexes for table `Locations`
--
ALTER TABLE `Locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Location_id_UNIQUE` (`id`),
  ADD UNIQUE KEY `code_UNIQUE` (`code`);

--
-- Indexes for table `Models`
--
ALTER TABLE `Models`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Model_id_UNIQUE` (`id`);

--
-- Indexes for table `Sales`
--
ALTER TABLE `Sales`
  ADD PRIMARY KEY (`id`,`employee_id`,`vehicle_id`,`location_id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_Sales_Employees1_idx` (`employee_id`),
  ADD KEY `fk_Sales_Vehicles1_idx` (`vehicle_id`),
  ADD KEY `fk_Sales_Locations1_idx` (`location_id`);

--
-- Indexes for table `Sales_has_Customers`
--
ALTER TABLE `Sales_has_Customers`
  ADD PRIMARY KEY (`sale_id`,`customer_id`),
  ADD KEY `fk_Sales_has_Customers_Customers1_idx` (`customer_id`),
  ADD KEY `fk_Sales_has_Customers_Sales_idx` (`sale_id`);

--
-- Indexes for table `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD PRIMARY KEY (`id`,`location_id`,`model_id`),
  ADD UNIQUE KEY `vehicle_id_UNIQUE` (`id`),
  ADD UNIQUE KEY `vin_UNIQUE` (`vin`),
  ADD KEY `fk_Vehicles_Locations1_idx` (`location_id`),
  ADD KEY `fk_Vehicles_Model1_idx` (`model_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Customers`
--
ALTER TABLE `Customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Employees`
--
ALTER TABLE `Employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Locations`
--
ALTER TABLE `Locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Models`
--
ALTER TABLE `Models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Sales`
--
ALTER TABLE `Sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Vehicles`
--
ALTER TABLE `Vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Employees`
--
ALTER TABLE `Employees`
  ADD CONSTRAINT `fk_Employees_Locations1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Sales`
--
ALTER TABLE `Sales`
  ADD CONSTRAINT `fk_Sales_Employees1` FOREIGN KEY (`employee_id`) REFERENCES `Employees`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Sales_Locations1` FOREIGN KEY (`location_id`) REFERENCES `Locations`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Sales_Vehicles1` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicles`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
--
-- Constraints for table `Sales_has_Customers`
--
ALTER TABLE `Sales_has_Customers`
  ADD CONSTRAINT `fk_Sales_has_Customers_Customers` FOREIGN KEY (`customer_id`) REFERENCES `Customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Sales_has_Customers_Sales` FOREIGN KEY (`sale_id`) REFERENCES `Sales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD CONSTRAINT `fk_Vehicles_Locations1` FOREIGN KEY (`location_id`) REFERENCES `Locations`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Vehicles_Model1` FOREIGN KEY (`model_id`) REFERENCES `Models`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;



-- insert sample data into the tables
INSERT INTO Customers (first_name, last_name, street, apartment, city, state, zip, telephone, email, created_date)
VALUES
('Ashley', "O'Connor", '34 Barton St', NULL, 'Knoxville', 'TN', '37914', '8654978867', 'aoc@gmail.com', '2019-03-16'),
('John', 'Shoemaker', '48 Washington Ave', NULL, 'Knoxville', 'TN', '37902', '8655673636', 'john.shoemaker@uspto.gov', '2020-10-04'),
('Chad', 'Smith', '120 Main St', 'Apt 303', 'Knoxville', 'TN', '37919', '8659267475', 'csmith@live.com', '2021-07-28'),
('William', 'Thompson', '17 Maple Ridge Ln', NULL, 'Chattanooga', 'TN', '37341', '4235768603', 'william.thompson@gmail.com', '2022-04-23'),
('Amanda', 'Thompson', '17 Maple Ridge Ln', NULL, 'Chattanooga', 'TN', '37341', '4236973215', 'amanda.thompson@gmail.com', '2022-04-23');

INSERT INTO Locations (code, street, city, state, zip, telephone)
VALUES
('TN001', '210 12th Street', 'Knoxville', 'TN', '37901', '8658874532'),
('TN002', '803 Liberty', 'Chattanooga', 'TN', '37402', '4238864365');

INSERT INTO Employees (location_id, type, first_name, last_name, work_telephone, work_email, hire_date, termination_date)
VALUES
(1, 'SALES', 'Joseph', 'Doiron', '9852272752', 'joe@jdmotors.com', '2021-12-31', '9999-12-31'),
(1, 'SALES', 'Bill', 'Roger', '9856658141', 'bill2@jdmotors.com', '2022-04-28', '9999-12-31'),
(1, 'SALES', 'John', 'DeRusso', '9856658141', 'john@jdmotors.com', '2022-04-29', '9999-12-31'),
(2, 'SALES', 'Elon', 'Musk', '5047220112', 'elon@jdmotors.com', '2022-04-27', '9999-12-31'),
(2, 'MANAG', 'Bill', 'Gates', '9852348521', 'bill@jdmotors.com', '2022-05-01', '9999-12-31');

INSERT INTO Models (manufacturer, model, model_year, generation, body_style_code)
VALUES
('Ford', 'Mustang', 2019, 2, 'CPE'),
('Ford', 'Explorer', 2021, 3, 'SUV'),
('Ford', 'Puma', 2019, 3, 'CPE'),
('Ford', 'Bronco', 2022, 3, 'SUV'),
('Toyota', '4Runner', 2021, 4, 'SUV');

INSERT INTO Vehicles (location_id, model_id, vin, color, trim, mileage, is_used, date_acquired, price_paid, msrp)
VALUES
(NULL, 1, '701787041',	'Black', 'Ecoboost Premium', 38, 0, '2019-03-09', 27225.00, 32225.00),
(NULL, 1, '692589118', 'Red', 'GT', 6812, 1, '2020-09-14', 29500.00, 37275.00),
(NULL, 2, '676321704', 'White', 'Limited', 27, 0, '2021-07-21', 41555.00, 46555.00),
(NULL, 4, '624236745', 'Blue', 'Outer Banks', 40, 0, '2022-04-20', 37950.00, 42950.00),
(2, 5, '776559754', 'Black', 'TRD Sport', 13157, 1, '2022-04-26', 26500.00, 40450.00),
(NULL, 2, '693335956', 'Blue', 'Limited', 10189, 1, '2022-01-04', 31750.00, 46555.00);

INSERT INTO Sales (employee_id, vehicle_id, location_id, date, purchase_price)
VALUES
(1, 1, 1, '2019-03-16', 29500.00),
(3, 2, 1, '2020-10-04', 31000.00),
(1, 3, 1, '2021-07-28', 44750.00),
(1, 6, 1, '2022-03-10', 33000.00),
(5, 4, 2, '2022-04-23', 43000.00);

INSERT INTO Sales_has_Customers (sale_id, customer_id)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 4),
(5, 5);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;