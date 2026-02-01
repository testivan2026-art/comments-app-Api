# 💬 Comments App API

REST API для SPA додатку, який дозволяє створювати ниткоподібні коментарі з можливістю прикріплення файлів, CAPTCHA валідації та HTML санітизації.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **MariaDB**
- **Swagger (OpenAPI)**
- **Multer** (для завантаження файлів)
- **Zod / express-validator** (валідація)
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
├─ example-file.jpg
package.json
package-lock.json
server.js
README.md

---

## 🗄 Database Schema

**Сутності:**
- **User**
- **Comment**
- **File**

**Відношення:**
- User → має багато Comments
- Comment → має багато Files
- Comment → self-referenced (parent_id)

> ERD схема для MySQL Workbench: [docs/shema.mwb]  
> Рекомендовано також зробити PNG експорт для швидкого перегляду.

---

## 🔐 Security

- SQL Injection захист через Sequelize ORM
- XSS захист через HTML санітизацію
- Валідація на сервері та клієнті
- Валідація типу та розміру файлів (JPG, PNG, GIF; TXT ≤100KB)
- CAPTCHA валідація (серверна заглушка)

---

## 🧪 API Documentation (Swagger)

Запустіть сервер та відкрийте:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Маршрути:

- `GET /comments` — отримати всі кореневі коментарі (пагінація, сортування)
- `GET /comments/:id` — отримати конкретний коментар
- `GET /comments/:id/files` — отримати файли коментаря
- `POST /comments` — створити коментар (підтримка файлів, CAPTCHA)
- `PATCH /comments/:id` — оновити текст коментаря
- `DELETE /comments/:id` — видалити коментар

**Приклад відповіді (GET /comments):**
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

Run Project
🐳 With Docker (recommended)
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
npm start
# або
node server.js

Example API Request

Create Comment:

POST /comments
Content-Type: application/json


{
  "username": "Ivan123",
  "email": "ivan@test.com",
  "homepage": "https://example.com",
  "text": "Hello world!",
  "parent_id": null,
  "captcha": "A1b2"
}

Implemented Features:

Threaded comments (parent / replies)

Pagination & sorting (LIFO default)

File upload (images / text)

Image resize to 320x240 px

CAPTCHA validation (server stub)

Swagger documentation

XSS & SQL Injection protection

Validation with Zod / express-validator

Notes

Для перегляду схеми використовуйте docs/shema.mwb у MySQL Workbench.

Docker піднімає MariaDB + API сервіс і повністю сумісний з бекендом.