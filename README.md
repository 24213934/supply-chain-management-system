# Supply Chain Management System

## Overview

The **Supply Chain Management System** is a microservices archietecture application for managing orders, inventory, suppliers, and user authentication. This guide will help you set up and run the project locally.

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16+)
- **npm** or **yarn**
- **Java 17+**
- **Spring Boot**
- **MySQL** (should be configured in your `application.properties` file)

## Project Structure

The project consists of multiple microservices along with this React front-end project:

1. **User Authentication & Access Control Service** (`user-authentication-access-control-service`)
2. **Order Management Service** (`order-management-service`)
3. **Inventory Management Service** (`inventory-management-service`)
4. **Supplier Management Service** (`supplier-management-service`)
5. **Basic Data Insights Service** (`basic-data-insights-service`)
6. **API Gateway** (`main`)

---

## Backend Setup

### Clone the microservices repositories

```sh
git clone https://github.com/24213934/user-authentication-access-control-service.git'
git clone https://github.com/24213934/inventory-management-service.git
git clone https://github.com/24213934/order-management-service.git
git clone https://github.com/24213934/supplier-management-service.git
git clone https://github.com/24213934/basic-data-insights-service.git
git clone https://github.com/24213934/main.git
```

### Set Up Local Database Connection

In `application.properties` file in each microservice's resources directory configure database connection settings by first creating three distinct databases in MySQL with name - `user_db, inventory_db, order_db`:

```env
spring.datasource.url=jdbc:mysql://localhost:3306/user_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

```env
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

```env
spring.datasource.url=jdbc:mysql://localhost:3306/order_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Run Each Microservice

Navigate to each microservice directory and start the service:

```sh
cd user-authentication-access-control-service
./mvnw spring-boot:run
```

Repeat the above step for all other microservices.

---

## Frontend Setup

### Clone the Frontend Repository

```sh
git clone https://github.com/24213934/supply-chain-management-system.git
```

### Install Dependencies

```sh
npm install  # or yarn install
```

### Start the Frontend

```sh
npm run dev  # or yarn start
```

The frontend will run on `http://localhost:5173`.

---
