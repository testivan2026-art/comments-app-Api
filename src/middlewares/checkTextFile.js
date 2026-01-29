import fs from 'fs';

export const checkTextFileSize = (req, res, next) => {
  if (!req.file) return next();

  if (req.file.mimetype === 'text/plain') {
    const size = fs.statSync(req.file.path).size;

    if (size > 100 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Text file must be smaller than 100 KB',
      });
    }
  }

  next();
};