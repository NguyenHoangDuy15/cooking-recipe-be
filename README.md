# 🍳 Simple Cooking Recipe API

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Fly.io](https://img.shields.io/badge/Deployed_on-Fly.io-24185b?style=for-the-badge&logo=flydotio&logoColor=white)

A robust and scalable Backend API for a Cooking Recipe Web Application. Built specifically to demonstrate clean architecture, modern backend practices, and cloud deployment.

---

## 🚀 Live Demo & Documentation

The API is fully deployed and includes an interactive **Swagger UI** documentation. You can test all endpoints directly from your browser!

👉 **[Live Swagger Documentation](https://cooking-recipe-be.fly.dev/api-docs)** 

---

## ✨ Key Features

- **Advanced Recipe Search:** Search recipes by keyword, filter by specific `cuisineId`, and filter by dynamic `ingredients`.
- **Comprehensive Details:** Fetch full recipe details including high-quality images, detailed ingredient lists, and step-by-step cooking instructions.
- **Image Upload Handling:** Secure and persistent image uploading mechanisms ready for production.
- **Seeded Database:** Comes with pre-seeded real-world data (Phở, Sushi, Pizza, etc.) for immediate testing.

---

## 🏗 Architecture & Best Practices

This project strictly follows the **3-Tier Architecture** (Controller -> Service -> Database) to ensure the codebase is clean, maintainable, and highly scalable:
- **Controllers:** Handle HTTP requests, parsing parameters, and returning standard JSON responses.
- **Services:** Contain core business logic (Regex searching, data formatting, cross-table querying).
- **Prisma ORM:** Provides type-safe database access and automatic schema migrations.
- **JSDoc Commenting:** All core functions are fully documented for developer experience (DX).

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v20)
- **Framework:** Express.js + TypeScript
- **Database:** MySQL (Hosted on Aiven Cloud)
- **ORM:** Prisma
- **Documentation:** Swagger UI (OpenAPI 3.0)
- **Deployment:** Fly.io (Dockerized with Persistent Volumes)

---

## 💻 Local Setup & Installation

If you want to run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd cooking-recipe-be
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure it:
```env
PORT=3000
DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<dbname>"
STORAGE_MODE="local"
```

### 4. Database Setup (Prisma)
Push the database schema and inject the seed data:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Start the Server
Run the application in development mode with hot-reload:
```bash
npm run dev
```
The server will start at `http://localhost:3000`. You can view the API documentation at `http://localhost:3000/api-docs`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | Get all recipes (supports `search`, `cuisineId`, `ingredients` queries) |
| `GET` | `/api/recipes/:id` | Get full details of a specific recipe |
| `POST` | `/api/recipes` | Create a new recipe |
| `GET` | `/api/cuisines` | Get a list of all available cuisines |
| `GET` | `/api/cuisines/:id/recipes` | Get all recipes belonging to a specific cuisine |
| `GET` | `/api/ingredients` | Get a list of all ingredients |
| `POST`| `/api/images` | Upload a new recipe photo |

*For complete payload and response details, please visit the [Swagger UI Documentation](https://cooking-recipe-be.fly.dev/api-docs).*
