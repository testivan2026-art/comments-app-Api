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

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get paginated comments
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 */
router.get("/", getComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getComment);

/**
 * @swagger
 * /comments/{id}/files:
 *   get:
 *     summary: Get files of comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Files list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 */
router.get("/:id/files", getCommentFiles);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create comment (JSON)
 *     tags: [Comments]
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
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Invalid captcha
 */
router.post(
  "/",
  commentLimiter,
  validateZod(createCommentSchema),
  checkCaptcha,
  sanitizeText,
  createComment
);

/**
 * @swagger
 * /comments/with-file:
 *   post:
 *     summary: Create comment with file
 *     tags: [Comments]
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

router.patch("/:id", validateZod(updateCommentSchema), sanitizeText, updateComment);
router.delete("/:id", deleteComment);

export default router;