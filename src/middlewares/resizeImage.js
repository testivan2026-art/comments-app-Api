import sharp from 'sharp';
import fs from 'fs';

export const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  // Якщо не image — просто пропускаємо
  if (!req.file.mimetype.startsWith('image/')) {
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

    return next();
  } catch (err) {
    console.error('Image resize error:', err);
    return res.status(400).json({ message: 'Image processing failed' });
  }
};