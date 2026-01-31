# 💬 Comments App API

REST API for SPA application that allows users to create threaded comments
with file attachments, captcha validation and HTML sanitization.

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

---

## 📂 Project Structure

config/
├─ .env
├─ db.js
docs/
├─ shema.mwb
node_modules/
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
├─ pngtree-snow-leopard-1769702092416.jpg
package.json
package-lock.json
server.js
README.md


---

## 🗄 Database Schema

Entities:
- **User**
- **Comment**
- **File**

Relations:
- User → has many Comments
- Comment → has many Files
- Comment → self-referenced (parent_id)

> Файл ERD для MySQL Workbench: [docs/shema.mwb](docs/shema.mwb)  
> Рекомендовано додати PNG експорт схеми для швидкого перегляду.

---

## 🔐 Security

- SQL Injection protection via Sequelize ORM
- XSS protection via HTML sanitization
- Server-side & client-side validation
- File type & size validation (images: JPG, PNG, GIF; text: TXT ≤100KB)
- CAPTCHA validation

---

## 🧪 API Documentation (Swagger)

Запустіть сервер та відкрийте:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Swagger документує всі маршрути:

- `GET /comments` — отримати всі кореневі коментарі (пагінація, сортування)
- `GET /comments/:id` — отримати конкретний коментар
- `GET /comments/:id/files` — отримати файли коментаря
- `POST /comments` — створити коментар (підтримка файлів, CAPTCHA)
- `PATCH /comments/:id` — оновити текст коментаря
- `DELETE /comments/:id` — видалити коментар

---

## ▶️ Run Project

### 🐳 With Docker (recommended)
```bash
# 1. Build & start containers
docker compose up --build -d

# 2. Check logs
docker compose logs -f

# 3. Stop containers
docker compose down

Without Docker
# 1. Install dependencies
npm install


# 2. Create .env file
DB_HOST=localhost
DB_USER=nodeuser
DB_PASSWORD=123456789!
DB_NAME=comments_app
DB_DIALECT=mariadb
PORT=3000


# 3. Start server
node server.js

Example API Requests

Create Comment:

POST /comments
{
  "username": "Ivan123",
  "email": "ivan@test.com",
  "homepage": "https://example.com",
  "text": "Hello world!",
  "parent_id": null,
  "captcha": "A1b2"
}

Implemented Features

Threaded comments (parent / replies)

Pagination & sorting (LIFO default)

File upload (images / text)

Image resize to 320x240 px

CAPTCHA validation

Swagger documentation

XSS & SQL Injection protection

Validation with Zod / express-validator

Notes

Для перегляду схеми використовуйте docs/shema.mwb у MySQL Workbench.

Docker повністю сумісний з бекендом і піднімає:

MariaDB

API сервіс