import express from 'express';
import {
  getFile,
  deleteFile,
  createFile,
  getFiles
} from '../controllers/fileController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Get all files
 *     responses:
 *       200:
 *         description: List of files
 */
router.get('/', getFiles);

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Get single file by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File object
 *       404:
 *         description: File not found
 */
router.get('/:id', getFile);

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload a new file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: integer
 *               type:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded
 *       400:
 *         description: Validation error
 */
router.post('/', upload.single('file'), createFile);

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Delete file
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File deleted
 *       404:
 *         description: File not found
 */
router.delete('/:id', deleteFile);

export default router;