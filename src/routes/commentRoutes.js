import express from 'express';
import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  getCommentFiles
} from '../controllers/commentController.js';

import { createCommentSchema, updateCommentSchema } from '../validators/commentSchema.js';
import { validateZod } from '../middlewares/validateZod.js';
import { sanitizeText } from '../middlewares/sanitize.js';
import { checkCaptcha } from '../middlewares/captcha.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all root comments
 *     description: Returns paginated root comments with users and files.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of comments per page
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order by creation date
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/', getComments);

/**
 * @swagger
 * /comments/{id}/files:
 *   get:
 *     summary: Get files for a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: List of files for the comment
 */
router.get('/:id/files', getCommentFiles);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a single comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment object
 *       404:
 *         description: Comment not found
 */
router.get('/:id', getComment);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
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
 *               homepage:
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
 *         description: Comment created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  upload.single('file'),
  validateZod(createCommentSchema),
  checkCaptcha,
  sanitizeText,
  createComment
);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated comment
 *       400:
 *         description: Validation error
 */
router.patch(
  '/:id',
  upload.single('file'),
  validateZod(updateCommentSchema),
  sanitizeText,
  updateComment
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', deleteComment);

export default router;