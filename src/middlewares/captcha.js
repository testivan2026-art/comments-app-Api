export const checkCaptcha = (req, res, next) => {
  const { captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ message: 'CAPTCHA is required' });
  }

  if (captcha !== process.env.CAPTCHA_SECRET) {
    return res.status(400).json({ message: 'Invalid CAPTCHA' });
  }

  next();
};