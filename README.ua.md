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

(config/ | docs/ | src/ | uploads/ | server.js | package.json | README.ua.md)

---

## 🔧 Налаштування DB для локального запуску та деплою

.env приклад:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=nodeuser
DB_PASSWORD=123456789!
DB_NAME=comments_app
DB_DIALECT=mariadb
PORT=3000

Railway / Render:

Використовуй секрети (Environment Variables) для безпечного зберігання паролів

Якщо виникають тайм-аути: збільш тайм-аут у config/db.js:


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
      connectTimeout: 10000, // 10 секунд
    },
  }
);


🏃 Запуск проєкту
🐳 Docker

docker compose up --build -d
docker compose logs -f
docker compose down


Локально
npm install
node server.js


🧪 API (Swagger)

http://localhost:3000/api-docs

GET /comments — кореневі коментарі

POST /comments/with-file — створити коментар з файлом (CAPTCHA)

PATCH /comments/:id — редагувати коментар

DELETE /comments/:id — видалити коментар

✅ Реалізовано

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

Docker автоматично піднімає MariaDB та API сервіс.

Для деплою на Render/Railway обов'язково використовуй environment variables замість .env



## ☁️ Деплой на Render

### 1️⃣ Створення Web Service

- Зайдіть у [Render Dashboard](https://dashboard.render.com/)
- Натисніть **New → Web Service**
- Підключіть ваш репозиторій GitHub
- Виберіть гілку: `main`
- Runtime: **Node.js**
- Build Command: `npm install && npm run build` (або просто `npm install`, якщо build не потрібен)
- Start Command: `node server.js` (або `npm start`)

### 2️⃣ Налаштування Environment Variables

У **Environment → Add Environment Variable** додайте:

| Ключ        | Значення (приклад)        |
|------------|---------------------------|
| DB_HOST    | `your-db-host`           |
| DB_PORT    | `3306` (або ваш порт)    |
| DB_USER    | `your-db-user`           |
| DB_PASSWORD| `your-db-password`       |
| DB_NAME    | `comments_app`           |
| DB_DIALECT | `mariadb`                |
| PORT       | `10000` (Render підставляє `$PORT`) |

> **Порада:** У `config/db.js` використовуйте `process.env.PORT || 3000`, щоб Render міг підставляти свій порт.

### 3️⃣ Збільшення тайм-ауту MariaDB (опційно)

Якщо при деплої виникають timeout-и:

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
      connectTimeout: 10000, // 10 секунд
    },
  }
);
4️⃣ Деплой та логування
Натисніть Deploy на Render

Логи доступні у Dashboard → Service → Logs

Перевірте, щоб зʼявилось: ✅ DB connection OK

Swagger документація: https://your-service.onrender.com/api-docs

5️⃣ Ініціалізація БД / Міграції
Переконайтесь, що ваша БД на Render / Railway створена

Використайте SQL dump або sequelize.sync() для створення таблиць та початкових даних

✅ Backend тепер запущено та готовий обробляти запити!