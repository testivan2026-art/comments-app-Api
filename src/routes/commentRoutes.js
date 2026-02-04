import express from 'express'
import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  getCommentFiles
} from '../controllers/commentController.js'

import { createCommentSchema, updateCommentSchema } from '../validators/commentSchema.js'
import { validateZod } from '../middlewares/validateZod.js'
import { sanitizeText } from '../middlewares/sanitize.js'
import { checkCaptcha } from '../middlewares/captcha.js'
import { upload } from '../middlewares/upload.js'
import { resizeImage } from '../middlewares/resizeImage.js'
import { checkTextFileSize } from '../middlewares/checkTextFile.js'

const router = express.Router()

// ---------- READ ----------
router.get('/', getComments)
router.get('/:id', getComment)
router.get('/:id/files', getCommentFiles)

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get paginated comments
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create comment (JSON, without file)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, text, captcha]
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
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post(
  '/',
  validateZod(createCommentSchema),
  checkCaptcha,
  sanitizeText,
  createComment
)

/**
 * @swagger
 * /comments/with-file:
 *   post:
 *     summary: Create comment with file (image or txt)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [username, email, text, captcha, file]
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
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comment with file created
 *       400:
 *         description: Validation error
 */
router.post(
  '/with-file',
  upload.single('file'),
  resizeImage,
  checkTextFileSize,
  validateZod(createCommentSchema),
  checkCaptcha,
  sanitizeText,
  createComment
)

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update comment text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 */
router.patch(
  '/:id',
  validateZod(updateCommentSchema),
  sanitizeText,
  updateComment
)

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/:id', deleteComment)

export default router