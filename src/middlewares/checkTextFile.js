

export function checkTextFileSize(req, res, next) {
  if (!req.file) return next(); // ✅ allow no file

  if (req.file.mimetype === 'text/plain' && req.file.size > 100 * 1024) {
    return res.status(400).json({ message: 'TXT file too large' });
  }

  next();
}