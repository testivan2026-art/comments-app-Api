---

# 📄 README.ua.md (Українською)

```md
# 💬 Comments App API

REST API для SPA-додатку, який дозволяє створювати ниткоподібні (вкладені) коментарі з можливістю прикріплення файлів, CAPTCHA-валідації та HTML-санітизації.

---

## 🚀 Технології

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **MariaDB**
- **Swagger (OpenAPI)**
- **Multer** (завантаження файлів)
- **Zod / express-validator** (валідація)
- **Docker / Docker Compose**

🇬🇧 English version: [README.md](README.md)

---

## 📂 Структура проєкту

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
README.ua.md

---

## 🗄 Схема бази даних

**Сутності:**
- **User**
- **Comment**
- **File**

**Звʼязки:**
- User → має багато Comments
- Comment → має багато Files
- Comment → самопосилання (parent_id)

> ERD схема:
> - `docs/shema.mwb` (MySQL Workbench)
> - `docs/Shema.png` (попередній перегляд)

---

## 🔐 Безпека

- Захист від SQL-інʼєкцій через Sequelize ORM
- Захист від XSS через HTML-санітизацію
- Валідація на сервері та клієнті
- Перевірка типу та розміру файлів:
  - Зображення: JPG, PNG, GIF (автоматичне зменшення до 320x240)
  - Текстові файли: TXT ≤ 100KB
- CAPTCHA (серверна заглушка, готова до інтеграції реального сервісу)

---

## 🧪 API Документація (Swagger)

Після запуску сервера відкрийте:

http://localhost:3000/api-docs

### Маршрути

- `GET /comments` — отримати кореневі коментарі (пагінація, сортування)
- `GET /comments/:id` — отримати конкретний коментар
- `GET /comments/:id/files` — файли коментаря
- `POST /comments` — створити коментар без файлу
- `POST /comments/with-file` — створити коментар з файлом (multipart/form-data, CAPTCHA)
- `PATCH /comments/:id` — оновити текст коментаря
- `DELETE /comments/:id` — видалити коментар

---

## 🏃 Запуск проєкту

### 🐳 За допомогою Docker

```bash
docker compose up --build -d
docker compose logs -f
docker compose down


💻 Без Docker
npm install

Створіть файл .env:
DB_HOST=localhost
DB_USER=nodeuser
DB_PASSWORD=123456789!
DB_NAME=comments_app
DB_DIALECT=mariadb
PORT=3000


Запуск сервера:
npm start
# або
node server.js


📨 Приклад API-запиту
{
  "username": "Ivan123",
  "email": "ivan@test.com",
  "homepage": "https://example.com",
  "text": "Hello world!",
  "parent_id": null,
  "captcha": "A1b2"
}


✅Реалізовано

Вкладені коментарі (parent / replies)

Пагінація та сортування (LIFO за замовчуванням)

Завантаження файлів (зображення / текст)

Автоматичне масштабування зображень до 320x240

CAPTCHA (серверна реалізація-заглушка)

Swagger-документація

Захист від XSS та SQL-інʼєкцій

Валідація через Zod / express-validator


📝 Примітки

Для перегляду схеми БД використовуйте docs/shema.mwb у MySQL Workbench.

Docker автоматично підіймає MariaDB та API-сервіс.