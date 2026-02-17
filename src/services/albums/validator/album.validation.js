import Joi from "joi";

export const albumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
});

export const albumUpdatePayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
});

const validatePayload = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    return next(err);
  }

  req.validated = value;
  return next();
};

export const validateAlbumPayload = validatePayload(albumPayloadSchema);
export const validateAlbumUpdatePayload = validatePayload(
  albumUpdatePayloadSchema
);
