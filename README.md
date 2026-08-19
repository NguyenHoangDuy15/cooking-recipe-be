# 🍳 Simple Cooking Recipe API

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Fly.io](https://img.shields.io/badge/Deployed_on-Fly.io-24185b?style=for-the-badge&logo=flydotio&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A robust and scalable Backend API for a Cooking Recipe Web Application. Built specifically to demonstrate clean architecture, modern backend practices, cloud deployment, and automated CI/CD pipelines.

---

## 🚀 Live Demo & Documentation

The API is fully deployed and includes an interactive **Swagger UI** documentation. You can test all endpoints directly from your browser!

👉 **[Live Swagger Documentation](https://cooking-recipe-be.fly.dev/api-docs)** 

---

## ✨ Key Features

- **Smart Fuzzy Search:** Advanced accent-insensitive Vietnamese search capability. Users can intuitively search "ga" to accurately find recipes like "Cơm Gà" without strict character or word-boundary limitations.
- **Comprehensive Details:** Fetch full recipe details including high-quality images, detailed ingredient lists, and step-by-step cooking instructions via joined tables.
- **Image Upload Handling:** Secure and persistent image uploading mechanisms via Docker mounted volumes.
- **Seeded Database:** Comes with pre-seeded real-world data (Phở, Sushi, Pizza, etc.) for immediate testing.
- **Automated CI/CD:** fully integrated with GitHub actions for zero-downtime automated deployments.

---

## 🏗 Architecture & Best Practices

This project strictly follows the **3-Tier Architecture** (Controller -> Service -> Database) to ensure the codebase is clean, maintainable, and highly scalable:
- **Controllers:** Handle HTTP requests, parsing parameters, and returning standard JSON responses.
- **Services:** Contain core business logic (Fuzzy search algorithms, data formatting, cross-table querying).
- **Prisma ORM:** Provides type-safe database access and automatic schema migrations.
- **JSDoc Commenting:** All core functions are fully documented for developer experience (DX).

---

## 💻 Local Setup & Installation

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
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<dbname>?sslaccept=accept_invalid_certs"
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

---

## ⚙️ CI/CD Deployment Guide

This project is configured with GitHub Actions to automatically deploy to Fly.io on every push to the `main` branch.

To enable this on your fork:
1. Generate a Fly API token: `fly tokens create deploy -x 999999h`
2. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
3. Create a New Repository Secret:
   - **Name:** `FLY_API_TOKEN`
   - **Secret:** *Paste the token here*
4. Now, running `git push` will automatically trigger a deployment!

---

## 📡 API Endpoints Documentation

### 1. Recipes API
#### `GET /api/recipes`
Fetch a paginated list of recipes. Supports query parameters for filtering:
- **`search`** *(optional)*: Fuzzy search by title or description (e.g., "ga" matches "gà").
- **`cuisineId`** *(optional)*: Filter by a specific Cuisine ID.
- **`ingredients`** *(optional)*: Filter by ingredient names (comma-separated).
- **`page` & `limit`**: Pagination controls.

#### `GET /api/recipes/:id`
Fetch the complete details of a specific recipe.
- **Response:** Returns the recipe object, including its `cuisine`, `image`, list of `ingredients`, and ordered cooking `instructions`.

#### `POST /api/recipes`
Create a new recipe in the database.
- **Payload:**
  ```json
  {
    "title": "Phở Bò",
    "description": "Món ăn truyền thống Việt Nam",
    "cuisineId": 1,
    "imageId": null,
    "ingredients": ["Bánh phở", "Thịt bò", "Hành lá"],
    "instructions": ["Ninh xương", "Thái thịt", "Chan nước dùng"]
  }
  ```

---

### 2. Cuisines API
#### `GET /api/cuisines`
Returns a flat list of all available cuisines (e.g., Vietnamese, Japanese, Italian) to populate UI dropdowns.

#### `GET /api/cuisines/:id/recipes`
Convenience endpoint to fetch all recipes belonging to a specific cuisine directly.

---

### 3. Ingredients API
#### `GET /api/ingredients`
Returns a list of all distinct ingredients stored in the database. Useful for auto-complete search inputs.

---

### 4. Images API
#### `POST /api/images`
Handles `multipart/form-data` uploads for recipe photos.
- **Field name:** `image`
- **Response:** Saves the image to the persistent volume and returns the generated Image record (including `id` and `url`), which can be attached to the Recipe Creation payload.
