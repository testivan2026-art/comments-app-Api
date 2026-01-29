import { File } from '../models/index.js';
import fs from 'fs';
import { Comment } from '../models/index.js';
// GET all files
export const getFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET file info
export const getFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST upload
export const createFile = async (req, res) => {
  try {
    const { comment_id, type } = req.body;

    if (!comment_id) {
      return res.status(400).json({ error: 'comment_id is required' });
    }

    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(400).json({ error: 'Comment does not exist' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = await File.create({
      comment_id,
      type,
      mimetype: req.file.mimetype,
      path: req.file.path,
      original_name: req.file.originalname,
      size: req.file.size
    });

    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// DELETE file
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    await file.destroy();
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};