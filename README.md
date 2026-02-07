🇺🇦 Ukrainian version: [README.ua.md](README.ua.md)

# 💬 Comments App API

REST API for an SPA application that supports threaded comments, file uploads, CAPTCHA validation, and HTML sanitization.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **MariaDB** (local, Railway or Render)
- **Swagger (OpenAPI)**
- **Multer** (file uploads)
- **Zod / express-validator**
- **Docker / Docker Compose**

---

## 📂 Project Structure

(config/ | docs/ | src/ | uploads/ | server.js | package.json | README.md)

---

## 🔧 DB Setup

### Local `.env` example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=nodeuser
DB_PASSWORD=123456789!
DB_NAME=comments_app
DB_DIALECT=mariadb
PORT=3000


Railway / Render

Use Environment Variables for credentials (instead of .env)

If you face connection timeouts, increase the timeout in config/db.js:

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 10000, // 10 seconds
    },
  }
);


🏃 Running the Project
🐳 With Docker
docker compose up --build -d
docker compose logs -f
docker compose down

💻 Without Docker
npm install
node server.js


🧪 API Documentation (Swagger)

Open after starting the server:

http://localhost:3000/api-docs

Routes

GET /comments — get root comments

POST /comments/with-file — create comment with file (CAPTCHA)

PATCH /comments/:id — update comment

DELETE /comments/:id — delete comment

Example Response (GET /comments)
{
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "comments": [
    {
      "id": 1,
      "text": "Hello world!",
      "user": {
        "id": 1,
        "username": "Ivan123",
        "email": "ivan@test.com"
      },
      "files": [],
      "replies": [],
      "created_at": "2026-02-01T12:00:00Z"
    }
  ]
}

✅ Implemented Features

Threaded comments (parent / replies)

Pagination & sorting (default: LIFO)

File uploads (images / text)

Automatic image resize to 320x240 px

CAPTCHA (server-side stub)

Swagger API documentation

SQL & XSS protection

Validation with Zod / express-validator

📝 Notes

Database schema: docs/shema.mwb

Docker setup automatically runs MariaDB and API service

For Render / Railway deployment, use environment variables for DB credentials instead of .env

Increase MariaDB connection timeout if needed (see above)


## ☁️ Render Deployment

### 1️⃣ Create a new Web Service

- Go to [Render Dashboard](https://dashboard.render.com/)
- Click **New → Web Service**
- Connect your GitHub repository
- Branch: `main`
- Runtime: **Node.js**
- Build Command: `npm install && npm run build` (or just `npm install` if no build)
- Start Command: `node server.js` (or `npm start`)

### 2️⃣ Set Environment Variables

Use **Environment → Add Environment Variable**:

| Key         | Value (example)           |
|------------|---------------------------|
| DB_HOST    | `your-db-host`           |
| DB_PORT    | `3306` (or your DB port)|
| DB_USER    | `your-db-user`           |
| DB_PASSWORD| `your-db-password`       |
| DB_NAME    | `comments_app`           |
| DB_DIALECT | `mariadb`                |
| PORT       | `10000` (Render assigns port via `$PORT`) |

> **Tip:** In `config/db.js`, use `process.env.PORT || 3000` to allow Render to inject the port.

### 3️⃣ Increase MariaDB Connection Timeout (Optional)

In case of deployment connection timeouts:

```js
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 10000, // 10 seconds
    },
  }
);
4️⃣ Deploy & Logs
Click Deploy on Render

View logs in Dashboard → Service → Logs

Make sure ✅ DB connection OK appears

Swagger docs: https://your-service.onrender.com/api-docs

5️⃣ Database Migration / Seeding
Make sure your DB on Render / Railway is initialized

Use your SQL dump (or Sequelize sync) to create tables and seed data

✅ Now your backend is live and ready to serve requests!