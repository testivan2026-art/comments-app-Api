export const checkCaptcha = (req, res, next) => {
  const { captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ message: 'CAPTCHA is required' });
  }

  // якщо секрет не заданий — captcha ВИМКНЕНО
  if (!process.env.CAPTCHA_SECRET) {
    console.warn('⚠ CAPTCHA_SECRET not set — captcha skipped');
    return next();
  }

  if (captcha !== String(process.env.CAPTCHA_SECRET)) {
    return res.status(400).json({ message: 'Invalid CAPTCHA' });
  }

  next();
};