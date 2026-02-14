import express from 'express';
import svgCaptcha from 'svg-captcha';

const router = express.Router();

router.get('/', (req, res) => {

  const captcha = svgCaptcha.create({
    size: 4,
    noise: 2,
    color: true,
    background: '#f2f2f2'
  });

  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
});

export default router;