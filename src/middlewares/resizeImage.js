import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  if (!req.file.mimetype.startsWith('image/')) {
    // TXT — не чіпаємо
    return next();
  }

  const filePath = req.file.path;
  const tempPath = filePath + '_resized';

  try {
    await sharp(filePath)
      .resize({
        width: 320,
        height: 240,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFile(tempPath);

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);

    next();
  } catch (err) {
    next(err);
  }
};