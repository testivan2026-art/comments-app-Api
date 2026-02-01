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

const router = express.Router()

// ---------- READ ----------
router.get('/', getComments)
router.get('/:id', getComment)
router.get('/:id/files', getCommentFiles)

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment (JSON)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       400:
 *         description: Validation error
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
 *     summary: Create a new comment with a file (multipart)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
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
  validateZod(createCommentSchema),
  checkCaptcha,
  sanitizeText,
  createComment
)

// ---------- UPDATE ----------
router.patch(
  '/:id',
  validateZod(updateCommentSchema),
  sanitizeText,
  updateComment
)

// ---------- DELETE ----------
router.delete('/:id', deleteComment)

export default router