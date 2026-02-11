import express from 'express';
import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  getCommentFiles
} from '../controllers/commentController.js';

import {
  createCommentSchema,
  updateCommentSchema
} from '../validators/commentSchema.js';

import { validateZod } from '../middlewares/validateZod.js';
import { sanitizeText } from '../middlewares/sanitize.js';
import { checkCaptcha } from '../middlewares/captcha.js';
import { upload } from '../middlewares/upload.js';
import { resizeImage } from '../middlewares/resizeImage.js';
import { checkTextFileSize } from '../middlewares/checkTextFile.js';

const router = express.Router();

/* ===========================
   READ
=========================== */

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
router.get('/', getComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment
 */
router.get('/:id', getComment);

/**
 * @swagger
 * /comments/{id}/files:
 *   get:
 *     summary: Get files of comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Files list
 */
router.get('/:id/files', getCommentFiles);

/* ===========================
   CREATE (JSON ONLY)
=========================== */

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
 *               homepage:
 *                 type: string
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
);

/* ===========================
   CREATE (WITH FILE)
=========================== */

/**
 * @swagger
 * /comments/with-file:
 *   post:
 *     summary: Create comment with optional file (image or txt)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               homepage:
 *                 type: string
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

  // 1️⃣ Parse multipart → req.body + req.file
  upload.single('file'),

 // 2️⃣ Validate parsed body
  validateZod(createCommentSchema),

  // 3️⃣ CAPTCHA
  checkCaptcha,

  // 4️ Sanitize text
  sanitizeText,


  // 5️⃣ File handling
  resizeImage,
  checkTextFileSize,

  // 6️⃣ Create comment
  createComment
);

/* ===========================
   UPDATE
=========================== */

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
);

/* ===========================
   DELETE
=========================== */

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
router.delete('/:id', deleteComment);

export default router;