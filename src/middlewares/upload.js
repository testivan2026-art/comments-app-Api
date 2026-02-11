import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageMime = ['image/jpeg', 'image/png', 'image/gif'];
  const allowedTextMime = ['text/plain'];

  if (
    allowedImageMime.includes(file.mimetype) ||
    allowedTextMime.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024, // глобальний safety-limit
  },
});