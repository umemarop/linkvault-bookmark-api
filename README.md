# 📌 LinkVault API

## 📖 Overview

LinkVault API is a RESTful Bookmark API built with **Node.js** and **Express**.

It allows users to efficiently create, retrieve, update, delete, search, and filter bookmarks.

> A production-ready REST API designed with scalability and maintainability in mind.

Key highlights:

- Centralized error handling
- Security middleware
- Swagger-based API documentation

---

## 🌐 Live Demo

API Base URL:  
https://linkvault-bookmark-api.onrender.com

Swagger Docs:  
https://linkvault-bookmark-api.onrender.com/api-docs/

---

## 🚀 Features

### ✅ Bookmark CRUD

- Create bookmark
- Get all bookmarks
- Get single bookmark
- Update bookmark
- Delete bookmark

### ✅ Advanced Query Features

- Filtering (category, tags, isFavorite)
- Searching (regex-based search)
- Sorting (latest, oldest, A-Z, Z-A)
- Field limiting
- Pagination (page, limit, total, totalPages)

### ✅ Data Handling

- Automatic slug generation
- Mongoose schema validation:
  - required
  - enum
  - maxlength
  - URL validation

### ✅ Core Architecture

- Centralized error handling system

### ✅ Security

- Helmet (secure HTTP headers)
- Rate limiting
- MongoDB sanitization (NoSQL injection prevention)

### ✅ Documentation

- Swagger (swagger-jsdoc, swagger-ui-express)

---

## 🛠 Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Swagger

---

## 📂 Project Structure

    project/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── utils/
    ├── middlewares/
    ├── docs/
    ├── dev-data/
    ├── app.js
    ├── server.js

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/umemarop/linkvault-bookmark-api.git
cd linkvault-bookmark-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

```bash
cp config.env.example config.env
```

### 4. Run the server

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `config.env` file in the root directory and add:

    NODE_ENV=development
    PORT=3000
    DATABASE_URL=your_mongodb_connection_string
    DATABASE_PASSWORD=your_database_password

---

## 📡 API Documentation

Swagger UI is available at:

http://localhost:3000/api-docs

---

## 🌱 Seed Data (Optional)

### Import sample data

```bash
node dev-data/data/import-dev-data.js --import
```

### Delete all data

```bash
node dev-data/data/import-dev-data.js --delete
```

---

## ⚠️ Important Notes

- This API does not include authentication (public API)
- Tags filter currently supports **single tag filtering**
- Swagger UI is available at /api-docs in both development and production.

---

## 📌 Example Request

    GET /api/v1/bookmarks?sort=latest&page=1&limit=10

---

## 📌 Example Error Response

```json
{
  "status": "fail",
  "message": "Invalid ID"
}
```

---

## ✅ Testing & Validation

All API endpoints were thoroughly tested using Postman and Swagger UI.

Test coverage includes:

- CRUD operations for bookmarks
- Advanced query features (filtering, sorting, pagination)
- Input validation (invalid data, missing fields)
- Error handling (invalid ID, non-existent resources)

All test cases passed successfully, confirming the stability and reliability of the API.

---

## 👨‍💻 Author

**Sanghun Han**\
Backend Developer (Node.js, Express)
