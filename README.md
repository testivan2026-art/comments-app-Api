# 💬 Comments App Frontend

SPA application built with **React + Vite** for interacting with the Comments App API.

Supports:
- Threaded comments
- File uploads
- Pagination
- Session-based CAPTCHA

---

## 🚀 Tech Stack

- React
- Vite
- Fetch / Axios
- Zod (optional)
- Tailwind CSS (optional)

---

## 📂 Project Structure

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

## ⚙ Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Production:

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🔐 Important: CAPTCHA Sessions

Backend uses **express-session**.

All requests must include credentials:

```js
fetch(`${import.meta.env.VITE_API_URL}/captcha`, {
  credentials: 'include'
});

fetch(`${import.meta.env.VITE_API_URL}/comments`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

Without `credentials: 'include'`, CAPTCHA will fail in production.

---

## 🏃‍♂️ Run Project

### Local

```
npm install
npm run dev
```

Open:
```
http://localhost:5173
```

---

## ✨ Features

- Nested comments
- Pagination
- File upload (image / text)
- Server-side image resize
- XSS protection
- Session-based CAPTCHA