import express from "express";
import svgCaptcha from "svg-captcha";
import crypto from "crypto";
import { Op } from "sequelize";
import sharp from "sharp";
import { Captcha } from "../models/index.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Captcha
 *   description: Captcha generation and validation
 */

/**
 * @swagger
 * /captcha:
 *   get:
 *     summary: Generate new captcha
 *     tags: [Captcha]
 *     description: |
 *       Генерує нову капчу.  
 *       Щоб переглянути капчу прямо у документації Swagger:
 *       <div>
 *         <img id="captchaImg" src="/captcha/image/fake-id" alt="Captcha" style="border:1px solid #ccc; margin-top:5px;" />
 *         <br/>
 *         <button onclick="
 *           const img = document.getElementById('captchaImg');
 *           fetch('/captcha').then(res => res.json()).then(data => {
 *             img.src = data.imageUrl + '?rand=' + Date.now();
 *           });
 *         ">Refresh Captcha</button>
 *       </div>
 *       <br/>
 *       JSON відповідь містить `captchaId` та `imageUrl`.
 *     responses:
 *       200:
 *         description: Captcha successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 captchaId:
 *                   type: string
 *                   format: uuid
 *                 imageUrl:
 *                   type: string
 *       500:
 *         description: Failed to generate captcha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", async (req, res) => {
  try {
    // Видаляємо старі капчі старші 5 хвилин
    await Captcha.destroy({
      where: {
        created_at: {
          [Op.lt]: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    // Генеруємо SVG капчу
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      background: "#f2f2f2",
    });

    // Хешуємо текст капчі
    const hash = crypto
      .createHash("sha256")
      .update(captcha.text.toLowerCase())
      .digest("hex");

    // Зберігаємо в базу
    const record = await Captcha.create({
      hash,
      svg: captcha.data,
    });

    res.status(200).json({
      captchaId: record.id,
      imageUrl: `/captcha/image/${record.id}`,
    });
  } catch (error) {
    console.error("Captcha generation error:", error);
    res.status(500).json({ message: "Failed to generate captcha" });
  }
});

/**
 * @swagger
 * /captcha/image/{id}:
 *   get:
 *     summary: Get captcha image as PNG
 *     tags: [Captcha]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: PNG image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Captcha not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to load captcha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/image/:id", async (req, res) => {
  try {
    const record = await Captcha.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Captcha not found" });
    }

    // Конвертація SVG у PNG
    const pngBuffer = await sharp(Buffer.from(record.svg, "utf-8"))
      .resize(150, 50) // розмір капчі
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(pngBuffer);
  } catch (err) {
    console.error("Captcha PNG error:", err);
    res.status(500).json({ message: "Failed to load captcha" });
  }
});

export default router;