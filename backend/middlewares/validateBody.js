export function validate(schema) {
  return (req, res, next) => {
    try {
      console.log("vv")
      req.body = schema.parse(req.body);
      return next();
    } catch (err) {
      return res.status(400).json({ error: err.errors ? err.errors.map(e => e.message) : err.message });
    }
  };
}
