import sanitizeHtml from 'sanitize-html';

export const sanitizeText = (req, res, next) => {
  if (req.body.text) {
    req.body.text = sanitizeHtml(req.body.text, {
      allowedTags: ['a', 'code', 'i', 'strong'],
      allowedAttributes: {
        a: ['href', 'title']
      },
      allowedSchemes: ['http', 'https', 'mailto']
    });
  }
  next();
};