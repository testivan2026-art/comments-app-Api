import express from "express";
import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  getCommentFiles,
} from "../controllers/commentController.js";

import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/commentSchema.js";

import { validateZod } from "../middlewares/validateZod.js";
import { sanitizeText } from "../middlewares/sanitize.js";
import { checkCaptcha } from "../middlewares/captcha.js";
import { upload } from "../middlewares/upload.js";
import { resizeImage } from "../middlewares/resizeImage.js";
import { checkTextFileSize } from "../middlewares/checkTextFile.js";
import { commentLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

/* ===========================
   READ
=========================== */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get paginated comments
 */
router.get("/", getComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comment by ID
 */
router.get("/:id", getComment);

/**
 * @swagger
 * /comments/{id}/files:
 *   get:
 *     summary: Get files of comment
 */
router.get("/:id/files", getCommentFiles);

/* ===========================
   CREATE (JSON)
=========================== */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create comment (JSON)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - text
 *               - captcha
 *               - captchaId
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               text:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               captcha:
 *                 type: string
 *               captchaId:
 *                 type: string
 */
router.post(
  "/",
  commentLimiter,
  validateZod(createCommentSchema),
  checkCaptcha,
  sanitizeText,
  createComment
);

/* ===========================
   CREATE (WITH FILE)
=========================== */

/**
 * @swagger
 * /comments/with-file:
 *   post:
 *     summary: Create comment with file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - text
 *               - captcha
 *               - captchaId
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               text:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               captcha:
 *                 type: string
 *               captchaId:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 */
router.post(
  "/with-file",
  commentLimiter,
  upload.single("file"),
  validateZod(createCommentSchema),
  checkCaptcha,
  sanitizeText,
  resizeImage,
  checkTextFileSize,
  createComment
);

/* ===========================
   UPDATE
=========================== */

router.patch(
  "/:id",
  validateZod(updateCommentSchema),
  sanitizeText,
  updateComment
);

/* ===========================
   DELETE
=========================== */

router.delete("/:id", deleteComment);

export default router;