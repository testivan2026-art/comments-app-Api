```md
# 💬 Comments App API

REST API для SPA-додатку з ниткоподібними коментарями, завантаженням файлів, CAPTCHA та HTML-санітизацією.

---

## 🚀 Технології

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **MariaDB** (локально, Railway або Render)
- **Swagger (OpenAPI)**
- **Multer** (завантаження файлів)
- **Zod / express-validator**
- **Docker / Docker Compose**

---

## 📂 Структура проєкту

config/ | docs/ | src/ | uploads/ | server.js | package.json | README.ua.md

---

## 🔧 Налаштування DB

- Локально використовуйте DB_HOST/DB_USER/DB_PASSWORD
- Продакшен (Render / Railway) використовуйте тільки `MYSQL_URL`

```js
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mariadb",
  logging: false,
  dialectOptions: { connectTimeout: 30000 },
  pool: { max: 5, min: 0, acquire: 60000, idle: 10000 },
});

export const testConnection = async () => {
  await sequelize.authenticate();
};
🏃‍♂️ Запуск проєкту
💻 Локально
bash
Копіювати код
npm install
node server.js
# http://localhost:3000
🐳 Docker
bash
Копіювати код
docker compose up --build -d
docker compose logs -f
docker compose down
🧪 API (Swagger)
http://localhost:3000/api-docs

GET /comments — кореневі коментарі

POST /comments/with-file — створити коментар з файлом (CAPTCHA)

PATCH /comments/:id — редагувати коментар

DELETE /comments/:id — видалити коментар

✅ Реалізовано:

Вкладені коментарі (parent/replies)

Пагінація та сортування

Завантаження файлів (зображення/текст)

Автоматичне масштабування зображень

CAPTCHA (серверна заглушка)

Swagger-документація

SQL & XSS захист

Валідація через Zod / express-validator

📝 Примітки
Схема БД: docs/shema.mwb

Docker автоматично піднімає MariaDB та API сервіс

Для деплою на Render/Railway обов'язково використовуй environment variables замість .env

☁️ Деплой на Render / Railway
1️⃣ Створення Web Service
Підключіть репозиторій GitHub

Виберіть гілку: main

Runtime: Node.js

Build Command: npm install (або npm install && npm run build)

Start Command: node server.js

2️⃣ Environment Variables
Ключ	Значення (приклад)
MYSQL_URL	mysql://root:password@hopper.proxy.rlwy.net:19858/railway
PORT	3000 (Render підставляє $PORT)
CAPTCHA_SECRET	1234

DB_HOST, DB_USER, DB_PASSWORD, DB_NAME більше не потрібні

3️⃣ Deploy та логування
Manual Deploy → Clear build cache & deploy

Логи повинні показати:

arduino
Копіювати код
✅ DB connected
🚀 Server running on port 3000
4️⃣ Ініціалізація БД / Міграції
Переконайтесь, що БД створена на Railway/Render

Використайте sequelize.sync() або SQL dump

yaml
Копіювати код
