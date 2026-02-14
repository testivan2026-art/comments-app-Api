export const checkCaptcha = (req, res, next) => {

  const { captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ message: 'CAPTCHA is required' });
  }

  if (!req.session.captcha) {
    return res.status(400).json({ message: 'CAPTCHA expired' });
  }

  if (captcha !== req.session.captcha) {
    return res.status(400).json({ message: 'Invalid CAPTCHA' });
  }

  delete req.session.captcha; // одноразова captcha

  next();
};