// Проста заглушка для перевірки CAPTCHA
// В реальному проекті сюди підключається сервіс або бібліотека для перевірки

export const checkCaptcha = (req, res, next) => {
  const { captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ error: 'CAPTCHA is required' });
  }

  // Тут можна додати реальну перевірку, наприклад через Redis або сторонній сервіс
  // Для тесту пропустимо будь-яку непорожню value
  if (captcha.trim() === '') {
    return res.status(400).json({ error: 'CAPTCHA cannot be empty' });
  }

  next();
};