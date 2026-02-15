import crypto from 'crypto';
import { Captcha } from '../models/index.js';

export const checkCaptcha = async (req, res, next) => {
  const { captcha, captchaId } = req.body;

  if (!captcha || !captchaId) {
    return res.status(400).json({ message: 'CAPTCHA is required' });
  }

  const record = await Captcha.findByPk(captchaId);

  if (!record) {
    return res.status(400).json({ message: 'CAPTCHA expired' });
  }

  const hash = crypto
    .createHash('sha256')
    .update(captcha.toLowerCase())
    .digest('hex');

  if (hash !== record.hash) {
    return res.status(400).json({ message: 'Invalid CAPTCHA' });
  }

  await record.destroy(); // одноразова

  next();
};