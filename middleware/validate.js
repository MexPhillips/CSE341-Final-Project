const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const data = {};
    if (req.body) Object.assign(data, req.body);
    if (req.params) Object.assign(data, req.params);
    if (req.query) Object.assign(data, req.query);

    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details.map((d) => d.message).join(', ') });
    }
    // attach cleaned values
    req.validated = value;
    return next();
  };
}

module.exports = { validate, Joi };
