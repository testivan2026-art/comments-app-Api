export const validateZod = (schema) => (req, res, next) => {
  try {
    console.log(req.body);
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      const errors = err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }));
      return res.status(400).json({ errors });
    }
    return res.status(400).json({ error: 'Invalid request' });
  }
};