import express from 'express';
import svgCaptcha from 'svg-captcha';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { Captcha } from '../models/index.js';

const router = express.Router();

/**
 * @swagger
 * /captcha:
 *   get:
 *     summary: Generate captcha
 *     tags:
 *       - Captcha
 *     responses:
 *       200:
 *         description: Returns captchaId and svg
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 captchaId:
 *                   type: string
 *                   format: uuid
 *                   example: "893fde37-a8c7-4aec-ab0e-fe0e53eaad37"
 *                 svg:
 *                   type: string
 *                   example: "<svg>...</svg>"
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    //  Видаляємо старі капчі (старше 5 хвилин)
    await Captcha.destroy({
      where: {
        created_at: {
          [Op.lt]: new Date(Date.now() - 5 * 60 * 1000)
        }
      }
    });

    //  Генеруємо нову капчу
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      background: '#f2f2f2'
    });

    //  Хешуємо текст
    const hash = crypto
      .createHash('sha256')
      .update(captcha.text.toLowerCase())
      .digest('hex');

    //  Зберігаємо в БД
    const record = await Captcha.create({ hash });

    res.status(200).json({
      captchaId: record.id,
      svg: captcha.data
    });

  } catch (error) {
    console.error('Captcha generation error:', error);
    res.status(500).json({
      message: 'Failed to generate captcha'
    });
  }
});

export default router;