export const checkCaptcha = (req, res, next) => {
  const { captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ message: 'CAPTCHA is required' });
  }

  if (!process.env.CAPTCHA_SECRET) {
    return next();
  }

  if (captcha !== String(process.env.CAPTCHA_SECRET)) {
    return res.status(400).json({ message: 'Invalid CAPTCHA' });
  }

  next();
};