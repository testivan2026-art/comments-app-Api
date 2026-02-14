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

comments-app-api/
│
├── config/
│   └── db.js
│
├── docs/
│   ├── shema.mwb
│   └── Shema.png
│
├── src/
│   ├── controllers/
│   │   ├── commentController.js
│   │   ├── fileController.js
│   │   └── userController.js
│   │
│   ├── middlewares/
│   │   ├── captcha.js
│   │   ├── checkTextFile.js
│   │   ├── resizeImage.js
│   │   ├── sanitize.js
│   │   ├── upload.js
│   │   └── validateZod.js
│   │
│   ├── models/
│   │   ├── Comment.js
│   │   ├── File.js
│   │   ├── User.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── captchaRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── fileRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── validators/
│   │   ├── commentSchema.js
│   │   └── userSchema.js
│   │
│   ├── app.js
│   └── swagger.js
│
├── uploads/
├── docker-compose.yml
├── Dockerfile
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── README.md
└── README.ua.md

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

## 🔐 CAPTCHA (session-based)

Використовується `express-session` + `svg-captcha`.

### 🔄 Flow роботи:

1️⃣ `GET /captcha`  
→ Генерує SVG з випадковим кодом  
→ Зберігає код у `req.session.captcha`  
→ Встановлює cookie `connect.sid`

2️⃣ `POST /comments`  
→ Користувач передає `captcha` у body  
→ Сервер порівнює з `req.session.captcha`  
→ Якщо співпадає — коментар створюється  
→ CAPTCHA одноразова (після перевірки видаляється)

⚠ У продакшені frontend повинен надсилати запити з:

```js
credentials: 'include'


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
