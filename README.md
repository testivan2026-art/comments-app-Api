```md
🇺🇦 Ukrainian version: [README.ua.md](README.ua.md)

# 💬 Comments App API

REST API for an SPA application that allows creating threaded comments with file attachments, CAPTCHA validation, and HTML sanitization.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **MariaDB**
- **Swagger (OpenAPI)**
- **Multer** (file uploads)
- **Zod / express-validator** (validation)
- **Docker / Docker Compose**

🇺🇦 Ukrainian version: [README.ua.md](README.ua.md)

---

## 📂 Project Structure

config/
├─ .env  
├─ db.js  
docs/
├─ shema.mwb  
├─ Shema.png  
src/
├─ controllers/
│ ├─ commentController.js
│ ├─ fileController.js
│ └─ userController.js
├─ middlewares/
│ ├─ captcha.js
│ ├─ checkTextFile.js
│ ├─ resizeImage.js
│ ├─ sanitize.js
│ ├─ upload.js
│ ├─ validate.js
│ └─ validateZod.js
├─ models/
│ ├─ Comment.js
│ ├─ File.js
│ ├─ User.js
│ └─ index.js
├─ routes/
│ ├─ commentRoutes.js
│ ├─ fileRoutes.js
│ └─ userRoutes.js
├─ validators/
│ ├─ commentSchema.js
│ ├─ commentValidator.js
│ ├─ userSchema.js
│ └─ userValidator.js
├─ app.js
└─ swagger.js
uploads/
├─ example-file.jpg
server.js
package.json
package-lock.json
README.md

---

## 🗄 Database Schema

**Entities:**
- **User**
- **Comment**
- **File**

**Relations:**
- User → has many Comments
- Comment → has many Files
- Comment → self-referenced (parent_id)

> ERD schema:
> - `docs/shema.mwb` (MySQL Workbench)
> - `docs/Shema.png` (preview)

---

## 🔐 Security

- SQL Injection protection via Sequelize ORM
- XSS protection via HTML sanitization
- Server-side and client-side validation
- File type & size validation:
  - Images: JPG, PNG, GIF (auto-resized to 320x240)
  - Text files: TXT ≤ 100KB
- CAPTCHA validation (server-side stub, ready for real provider)

---

## 🧪 API Documentation (Swagger)

After starting the server, open:

http://localhost:3000/api-docs

### Routes

- `GET /comments` — get root comments (pagination, sorting)
- `GET /comments/:id` — get single comment
- `GET /comments/:id/files` — get comment files
- `POST /comments` — create comment without file
- `POST /comments/with-file` — create comment with file (multipart/form-data, CAPTCHA)
- `PATCH /comments/:id` — update comment text
- `DELETE /comments/:id` — delete comment

### Example response (GET /comments)

```json
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


🏃 Run Project

🐳 With Docker
docker compose up --build -d
docker compose logs -f
docker compose down

💻 Without Docker
npm install

Create .env file:
DB_HOST=localhost
DB_USER=nodeuser
DB_PASSWORD=123456789!
DB_NAME=comments_app
DB_DIALECT=mariadb
PORT=3000

Start server:
npm start
# or
node server.js

📨 Example API Request
Create comment (optional homepage)
{
  "username": "Ivan123",
  "email": "ivan@test.com",
  "homepage": "https://example.com",
  "text": "Hello world!",
  "parent_id": null,
  "captcha": "A1b2"
}

✅ Implemented Features

Threaded comments (parent / replies)

Pagination & sorting (default: LIFO)

File upload (images / text)

Automatic image resize to 320x240 px

CAPTCHA validation (server-side stub)

Swagger API documentation

XSS & SQL Injection protection

Validation with Zod / express-validator

📝 Notes

Use docs/shema.mwb to view database schema in MySQL Workbench.

Docker setup runs MariaDB and API services out of the box.
