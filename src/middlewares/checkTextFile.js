export function checkTextFileSize(req, res, next) {
  if (!req.file) return next();

  if (
    req.file.mimetype === "text/plain" &&
    req.file.size > 100 * 1024
  ) {
    return res.status(400).json({
      status: "error",
      message: "TXT file too large (max 100KB)",
    });
  }

  next();
}